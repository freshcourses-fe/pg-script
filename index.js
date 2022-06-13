const { Client } = require('pg');

const { getUsers } = require('./api');
const config = {
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'training',
  port: 5432,
};

const client = new Client(config);

const usersToInsert = [
  {
    firstName: 'js',
    lastName: 'Jsovich',
    email: 'js@mail.com',
    isMale: true,
    birthday: '1980/5/7',
  },
  {
    firstName: 'Null',
    lastName: 'Nullovna',
    email: 'nullovna@mail.com',
    isMale: false,
    birthday: '1957/3/3',
  },
];

function mapUsers (usersArray) {
  //  ('Node', 'Nodenko', 'fromNode@mail.com', true)[]
  const insertValuesStringsArr = usersArray.map(
    user =>
      `('${user.name.first}', '${user.name.last}', '${user.email}', ${user.gender === 'male'}, '${user.dob.date}')`
  );

  const insertString = insertValuesStringsArr.join(',');
  return insertString;
}

async function start () {
  const usersToInsert = await getUsers();

  await client.connect();

  const res = await client.query(`INSERT INTO users (first_name, last_name, email, is_male, birthday)
  VALUES ${mapUsers(usersToInsert)}`);

  console.log(res);

  await client.end();
}

start();
