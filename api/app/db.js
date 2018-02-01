const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/dev');

const db = mongoose.connection;

db.once('open', () => {
  console.log('connected');
});

module.exports = db;
