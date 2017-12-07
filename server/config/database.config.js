require('dotenv').config();
const mongoose = require('mongoose');
const db_url = process.env.DB_URL || 'mongodb://localhost/iron-trivial';
const dbName = 'iron-trivial';

mongoose.connect(db_url, {useMongoClient: true});
mongoose.Promise = Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbName} database`);
});

module.exports = db;
