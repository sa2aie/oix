
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConsumersSchema = new Schema({
  endpoint: {
    type: String,
    required: 'endpoint url i missing'
  },
  address: {
    type: String,
    required: 'address is missing'
  },
  type: {
    type: {
      type: String,
      enum: ['public', 'private', 'hidden'],
      required: 'type is missing'
    },
    default: ['public']
  },
  public_key_type: {
    type: String,
    required: 'public_key_type is missing'
  },
  public_key: {
    type: String,
    required: 'public_key is missing'
  },
  environment: {
    type: String,
    enum: ['test', 'development', 'production']
  },
  accepts: [{
    type: String,
    enum: ['test', 'development', 'production']
  }],
  versions: [{
    type: String,
    enum: ['v1.0','v1.1','v2.0', 'dev']
  }],

});

module.exports = mongoose.model('Consumers', ConsumersSchema);
