const { mapUsers } = require('../utils');

class User {
  static _client;
  static _tableName = 'users';

  static async bulkCreate (users) {

    const {rows} = await this._client
      .query(`INSERT INTO users (first_name, last_name, email, is_male, birthday, height)
    VALUES ${mapUsers(users)} RETURNING *`);
    return rows;
  }

  static async findAll () {
    return this._client.query(`SELECT * FROM ${this._tableName}`);
  }
}

module.exports = User;
