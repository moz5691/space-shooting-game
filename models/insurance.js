/* eslint-disable */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InsuranceSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true
  }
});

const Insurance = mongoose.model('Insurance', InsuranceSchema);

module.exports = Insurance;
