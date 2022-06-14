const { mapProducts } = require('../utils');
class Product {
  static _client;
  static _tableName = 'products';

  static async bulkCreate (products) {
    const { rows } = await this._client.query(`
    INSERT INTO "${this._tableName}" (
      "seller_id",
      "name",
      "price", 
      "quantity",
      "category"
    ) VALUES ${mapProducts(products)}
    RETURNING *;`);
    return rows;
  }
}

module.exports = Product;
