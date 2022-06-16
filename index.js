const path = require('path');
const fs = require('fs').promises;
const _ = require('lodash');
const { client, User, Seller, Product } = require('./models');
const { getUsers } = require('./api');
const { shouldBeCreated, createManyProducts } = require('./utils');

const {
  sellerChance,
  productsAmount,
  orderChance,
  maxOrders,
  maxProductQuantityInOrder,
  maxProductsInOrder,
  addresses: addressList,
} = require('./configs/generationParams.json');

async function start () {
  // Качаем юзеров с инета
  const usersToInsert = await getUsers();

  await client.connect();

  // запускаем скрипт из папки sql для очистки БД
  const resetDbQueryString = await fs.readFile(
    path.join(__dirname, '/sql/reset-db-query.sql'),
    'utf8'
  );
  await client.query(resetDbQueryString);

  // создаем юзеров в БД и получаем их в массиве (благодаря RETUNING * в модели)
  const users = await User.bulkCreate(usersToInsert);

  // Создаем массив для создания строки для INSERT INTO sellers
  // (саму строку сделает утилитка вызванная в модели)
  // у каждого пользоватля есть 33% шанс стать продавцом
  const sellersToBeCreated = users
    .map(user =>
      shouldBeCreated(sellerChance)
        ? {
            userId: user.id,
            address: addressList[_.random(0, addressList.length - 1)],
            phone: `+38-0${_.random(10,99)}-${_.random(100,999)}-${_.random(10,99)}-${_.random(10,99)}`,
          }
        : undefined
    )
    .filter(seller => seller);

  // создаем продавцов в БД и получаем их в массиве (благодаря RETUNING * в модели)
  const sellers = await Seller.bulkCreate(sellersToBeCreated);

  // они вставились с айдишниками по порядку
  // поэтому из возвращенного массива берем первый и последний айдишник
  // для создания продуктов
  const minSellerId = sellers[0].id;
  const maxSellerId = sellers[sellers.length - 1].id;

  // генерируем 1000 продуктов без айдишников продавцов
  const productsToBeCreatedWithoutSellers = createManyProducts(productsAmount);

  // привиниваем айдишники продавцов продуктам
  const productsToBeCreated = productsToBeCreatedWithoutSellers.map(product => {
    const sellerId = _.random(minSellerId, maxSellerId); // айди будет рандомным из диапазона мин - макс айдишника

    return { ...product, sellerId };
  });

  // создаем товары в БД и получаем их в массиве (благодаря RETUNING * в модели)
  const products = await Product.bulkCreate(productsToBeCreated);

  // создаем строку для INSERT в заказах для пользователей
  // у пользователя 25% шанс создать от 1 до 5 заказов
  const ordersToBeCreated = users
    .map(u => {
      return shouldBeCreated(orderChance)
        ? new Array(_.random(1, maxOrders))
            .fill(null)
            .map(() => `(${u.id})`)
            .join(',')
        : undefined;
    })
    .filter(order => order);

  // Создаем заказы и возващаем их для айдишиков
  const { rows: orders } = await client.query(`
  INSERT INTO orders (buyer_id)
  VALUES ${ordersToBeCreated}
  RETURNING id;
  `);

  //генерируем строку для инсерта в products_to_orders
  const productsToOrdersString = orders.map(order => {
    // для каждого заказа создаем массив случайной длины с продуктами которые в нем будут
    const productsThatWillBeOrdered = new Array(_.random(1, maxProductsInOrder))
      .fill(null)
      .map(() => products[_.random(1, products.length - 1)]);

    // возвращаем строку для инсерта из которой сначала вынимаем потенциальные повторения
    // с помощью Set ( в одном заказе не может быть повторяющихся продуктов для этого есть количество)
    return [...new Set(productsThatWillBeOrdered)].map(
      product =>
        `(${order.id}, ${product.id}, ${_.random(1, maxProductQuantityInOrder)})`
    );
  });

  // заполняем products_to_orders данными
  await client.query(`
  INSERT INTO products_to_orders ("order_id", "product_id", "quantity")
  VALUES ${productsToOrdersString};
`);

  await client.end();
}

start();
