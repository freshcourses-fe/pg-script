const { mapSellers } = require('../utils');

class Seller {
  static _client;
  static _tableName = 'sellers';

  static async bulkCreate (sellers) {
    const { rows } = await this._client.query(`INSERT INTO ${
      this._tableName
    } (user_id, address, phone)
    VALUES ${mapSellers(sellers)} RETURNING *`);
    return rows;
  }

  static async findAll () {
    return this._client.query(`SELECT * FROM ${this._tableName}`);
  }
}

module.exports = Seller;
