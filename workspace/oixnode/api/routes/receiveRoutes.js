'use strict';
module.exports = function(app) {
  var receive = require('../controllers/receiveController');

  app.route('/receive')
    .post(receive.receive_message);

};
