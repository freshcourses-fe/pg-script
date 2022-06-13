const axios = require('axios').default;

module.exports.getUsers = async () => {
  const {data: {results}} = await axios.get('https://randomuser.me/api?seed=test&results=1000&page=1');
  return results;
}
