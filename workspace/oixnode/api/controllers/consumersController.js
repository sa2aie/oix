'use strict';


var mongoose = require('mongoose'),
  Consumer = mongoose.model('Consumers');

exports.list_all_tasks = function(req, res) {
  Consumer.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create_a_task = function(req, res) {
  var new_task = new Consumer(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.read_a_task = function(req, res) {
  Consumer.findById(req.params.consumerId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Consumer.findOneAndUpdate({_id: req.params.consumerId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.find_a_task = function(address,callback) {
  Consumer.findOne({address: address}, function(err, task) {
    if (err)
      throw(err);
    callback(task);
  });
};


exports.delete_a_task = function(req, res) {


  Consumer.remove({
    _id: req.params.consumerId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
