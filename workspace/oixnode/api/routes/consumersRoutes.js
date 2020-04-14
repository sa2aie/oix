'use strict';
module.exports = function(app) {
  var consumersList = require('../controllers/consumersController');

  // todoList Routes
  app.route('/consumers')
    .get(consumersList.list_all_tasks)
    .post(consumersList.create_a_task);


  app.route('/consumers/:consumerId')
    .get(consumersList.read_a_task)
    .put(consumersList.update_a_task)
    .delete(consumersList.delete_a_task);
};
