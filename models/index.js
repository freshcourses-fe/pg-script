const { Client } = require('pg');
const dbConfig = require('../configs/db.json');
const User = require('./User');
const Seller = require('./Seller');
const Product = require('./Product');

const client = new Client(dbConfig);

User._client = client;
Seller._client = client;
Product._client = client;

module.exports = {
  client,
  User,
  Seller,
  Product,
};
