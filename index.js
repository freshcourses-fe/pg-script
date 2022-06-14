const path = require('path');
const fs = require('fs').promises;
const _ = require('lodash');
const { client, User, Seller, Product } = require('./models');
const { getUsers } = require('./api');
const { shouldBeCreated, createManyProducts } = require('./utils');
const {
  phones: phoneList,
  addresses: addressList,
  categories,
  productNames,
} = require('./configs/randomLists.json');

async function start () {
  const usersToInsert = await getUsers();

  await client.connect();

  const resetDbQueryString = await fs.readFile(
    path.join(__dirname, '/sql/reset-db-query.sql'),
    'utf8'
  );

  await client.query(resetDbQueryString);

  const users = await User.bulkCreate(usersToInsert);

  const sellersToBeCreated = users
    .map(user =>
      shouldBeCreated(33)
        ? {
            userId: user.id,
            address: addressList[_.random(0, addressList.length - 1)],
            phone: phoneList[_.random(0, phoneList.length - 1)],
          }
        : undefined
    )
    .filter(seller => seller);

  const sellers = await Seller.bulkCreate(sellersToBeCreated);

  const minSellerId = sellers[0].id;
  const maxSellerId = sellers[sellers.length - 1].id;

  console.log(minSellerId, maxSellerId);

  const productsToBeCreatedWithoutSellers = createManyProducts(1000);

  const productsToBeCreated = productsToBeCreatedWithoutSellers.map(product => {
    const sellerId = _.random(minSellerId, maxSellerId);

    return { ...product, sellerId };
  });

  const products = await Product.bulkCreate(productsToBeCreated);

  const ordersToBeCreated = users
    .map(u => {
      return shouldBeCreated(25)
        ? new Array(_.random(1, 5))
            .fill(null)
            .map(() => `(${u.id})`)
            .join(',')
        : undefined;
    })
    .filter(order => order);

  const { rows: orders } = await client.query(`
  INSERT INTO orders (buyer_id)
  VALUES ${ordersToBeCreated}
  RETURNING id;
  `);

  const productsToOrdersString = orders.map(order => {
    const productsThatWillBeOrdered = new Array(_.random(1, products.length))
      .fill(null)
      .map(() => products[_.random(1, products.length - 1)]);

    return [...new Set(productsThatWillBeOrdered)].map(
      product => `(${order.id}, ${product.id}, ${_.random(1, 100)})`
    );
  });

  await client.query(`
  INSERT INTO products_to_orders ("order_id", "product_id", "quantity")
  VALUES ${productsToOrdersString};
`);

  await client.end();
}

start();
