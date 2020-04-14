'use strict';
module.exports = function(app) {
  var transmit = require('../controllers/transmitController');

  app.route('/transmit')
    .post(transmit.transmit_message);

};
