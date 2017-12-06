require('dotenv').config();
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;
const dbName = 'iron-trivia';

mongoose.connect(db_url, {useMongoClient: true})
  .then(() => console.log('Conectado a la db'))
  .catch(err => console.error(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbName} database`);
});
