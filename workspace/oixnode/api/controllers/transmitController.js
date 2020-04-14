'use strict';

exports.transmit_message  = function(req, res) {

  var message = JSON.parse(req.body);

  res.json(message);

  };
