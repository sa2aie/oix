'use strict';

exports.transmit_message  = function(req, res) {

  var message = req.body;

  res.json(message);

  };
