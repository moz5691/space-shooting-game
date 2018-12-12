/* eslint-disable */

/**
 * @author Maryam
 * @description user add, search and all user and update table on db
 */
const db = require('../models/');
const RestfulAPI = require('./RestClass');

module.exports = function (app) {
  const user = new RestfulAPI('user', app, db.User);
  user.find();
  user.findone('username');
  user.create();
  user.findOneAndUpdate('userName');
  user.deleteOne();
};
