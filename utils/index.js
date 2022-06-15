const _ = require('lodash');
const { categories, productNames } = require('../configs/randomLists.json');
const {
  productGen: { maxPrice, maxQuantity, minPrice, minQuantity },
  users: {minHeight, maxHeight}
} = require('../configs/generationParams.json');

function mapUsers (usersArray) {
  //  ('Node', 'Nodenko', 'fromNode@mail.com', true)[]
  const insertValuesStringsArr = usersArray.map(
    user =>
      `('${user.name.first}', '${user.name.last}', '${
        user.email
      }', ${user.gender === 'male'}, '${user.dob.date}', ${_.random(minHeight, maxHeight, true)})`
  );

  const insertString = insertValuesStringsArr.join(',');
  return insertString;
}

function mapSellers (sellers) {
  return sellers
    .map(seller => `(${seller.userId}, '${seller.address}', '${seller.phone}')`)
    .join(',');
}

function mapProducts (products) {
  return products
    .map(
      ({ sellerId, name, price, quantity = 1, category }) =>
        `(${sellerId},'${name}', ${price}, ${quantity}, '${category}')`
    )
    .join(',');
}

function createProduct (key) {
  const baseProductName = productNames[_.random(0, productNames.length - 1)];
  return {
    name: `${baseProductName}-${_.random(0, 9000)}__${key}`, // phone-5000__10
    price: _.random(minPrice, maxPrice, false),
    quantity: _.random(minQuantity, maxQuantity, false),
    category: categories[_.random(0, categories.length - 1)],
  };
}

const createManyProducts = (amount = 100) =>
  new Array(amount).fill(null).map((_, i) => createProduct(i));

const shouldBeCreated = (chance = 100) => _.random(1, 100) < chance;

module.exports.mapUsers = mapUsers;
module.exports.mapSellers = mapSellers;
module.exports.mapProducts = mapProducts;
module.exports.shouldBeCreated = shouldBeCreated;
module.exports.createManyProducts = createManyProducts;
