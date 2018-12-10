const db = require('../models/');
const RestfulAPI = require('./RestClass');

module.exports = function (app) {
  const user = new RestfulAPI('user', app, db.User);
  user.find();
  user.findone('username');
  user.create();
  user.findOneAndUpdate('userName');
};
