/* eslint-disable */
/**
 * @author maryam
 * @description user model for mongoose to store score for leader board
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
