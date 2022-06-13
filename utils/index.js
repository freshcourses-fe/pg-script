function mapUsers (usersArray) {
  //  ('Node', 'Nodenko', 'fromNode@mail.com', true)[]
  const insertValuesStringsArr = usersArray.map(
    user =>
      `('${user.name.first}', '${user.name.last}', '${
        user.email
      }', ${user.gender === 'male'}, '${user.dob.date}')`
  );

  const insertString = insertValuesStringsArr.join(',');
  return insertString;
}

module.exports.mapUsers = mapUsers;
