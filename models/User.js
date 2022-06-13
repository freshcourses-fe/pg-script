const { mapUsers } = require('../utils');

class User {
  static _client;
  static _tableName = 'users';

  static async bulkCreate (users) {
    console.log(users);
    const res = await this._client
      .query(`INSERT INTO users (first_name, last_name, email, is_male, birthday)
    VALUES ${mapUsers(users)}`);
    return res;
  }

  static async findAll () {
    return this._client.query(`SELECT * FROM ${this._tableName}`);
  }
}

module.exports = User;
