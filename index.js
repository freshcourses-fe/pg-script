const { client, User } = require('./models');
const { getUsers } = require('./api');

async function start () {
  const usersToInsert = await getUsers();

  await client.connect();

  await User.bulkCreate(usersToInsert);

  await client.end();
}

start();
