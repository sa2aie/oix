'use strict';
var messagequeue = require('../library/messageQueuing');
var async = require('async');

var mongoose = require('mongoose'),
  Consumer = mongoose.model('Consumers');

function enqueueMessage(consumer)
{
  if (consumer != null)
    messagequeue.publish("", consumer.address, req.body);//new Buffer(req.body));

}

 exports.receive_message  = function(req, res) {

 console.log("Receive message");
 let films = await Promise.all(
   req.body.envelope.header.recipients.map(async recipient => {
     let filmResponse = await fetch(recipient)
     return filmResponse.json()
   })
 )
async.map(req.body.envelope.header.recipients,)
 Consumer.findOne({address: address}, function(err, consumer) {
   if (err)
     return;
   callback(consumer);
 });

  //res.json(message);

 res.json(req.body.envelope.header.recipients);

};
