const { Client } = require('pg');
const dbConfig = require('../configs/db.json');
const User = require('./User');

const client = new Client(dbConfig);

User._client = client;

module.exports = {
  client,
  User,
};
