// rabbit vhost oix, user oix, pass badpass

var amqp = require('amqplib/callback_api');
var mongoose = require('mongoose'),
  Consumer = mongoose.model('Consumers');
  const config = require('config');
const dns = require('dns');
const axios = require('axios')


var amqpConn = null;
var pubChannel = null;
var offlinePubQueue = [];
var sendchan = null;


function sendMessageToHost(msg, host,port)
{

  axios.post("http://localhost:"+port+"/receive", msg)
  .then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
    //console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
}

function sendMessage(msg, recipient)
{
    var addressparts = recipient.split('@');
  /*  dns.resolveSrv("_oix._tcp."+domain,function handleDnsResponse(err,addresses){
    //   {
    // priority: 10,
    // weight: 5,
    // port: 21223,
    // name: 'service.example.com'
    // }*/
    //  if (err)
    //    return;
    //  sendMessage(msg,addresses[0].name,addresses[0].port);
    //}
    sendMessageToHost(msg,"localhost",3000);



}

function work(msg, cb) {
  console.log("Processing: ", msg.content.toString());
  var m = JSON.parse(msg.content.toString());
  m.envelope.transitinformation.timetolive --;
  if (m.envelope.transitinformation.timetolive <= 0)
    console.log("Dropping message due to ttl expiration");
  else
    sendMessage(m,"");


  cb(true);
}

exports.start = function () {
  const mqconfig = config.get('messaging');
  console.log("[AMQP] connecting...");

  amqp.connect(mqconfig.amqp_uri + "?heartbeat=60", function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(exports.start, 1000);
    }

    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });

    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(exports.start, 1000);
    });

    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}


function whenConnected() {
  startPublisher();
  startWorker();
}


function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) {
      console.error("[AMQP_PUB] error:", err.message)
      return;
    }
    ch.on("error", function(err) {
      console.error("[AMQP_PUB] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP_PUB] channel closed");
    });

    pubChannel = ch;
//    while (true) {
//      var [exchange, routingKey, content] = offlinePubQueue.shift();
//      publish(exchange, routingKey, content);
//    }
  });
}

exports.publish = function(exchange, routingKey, content) {
  try {
    console.log("[AMQP] publish  routingKey ", routingKey);
    console.log("[AMQP] content:",content);
   pubChannel.publish(exchange, routingKey, new Buffer(JSON.stringify(content)), { persistent: true },
                      function(err, ok) {
                        if (err) {
                          console.error("[AMQP] publish", err);
                          offlinePubQueue.push([exchange, routingKey, content]);
                          pubChannel.connection.close();
                        }
                      });
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}

// A worker that acks messages only if processed successfully
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });
    sendchan = ch;
    ch.prefetch(10);
    ch.assertQueue("outgoing", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("outgoing", processMsg, { noAck: false });
      console.log("[AMQP] Worker is started");
    });
  });
}

function processMsg(msg) {
  work(msg, function(ok) {
    try {
      if (ok)
        sendchan.ack(msg);
      else
        sendchan.reject(msg, true);
    } catch (e) {
      closeOnErr(e);
    }
  });
}



function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

//
// setInterval(function() {
//   publish("", "jobs", new Buffer("work work work"));
// }, 1000);

//start();
