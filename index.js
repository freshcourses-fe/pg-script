const { Client } = require('pg');

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
      `('${user.firstName}', '${user.lastName}', '${user.email}', ${user.isMale}, '${user.birthday}')`
  );

  const insertString = insertValuesStringsArr.join(',');
  return insertString;
}

async function start () {
  await client.connect();

  const res = await client.query(`INSERT INTO users (first_name, last_name, email, is_male, birthday)
  VALUES ${mapUsers(usersToInsert)}`);

  console.log(res);

  await client.end();
}

start();
