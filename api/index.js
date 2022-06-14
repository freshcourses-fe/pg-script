const axios = require('axios').default;
const queryString = require('query-string');

const {
  baseUrl,
  get: { users: usersGetConfig },
} = require('../configs/api.json');

module.exports.getUsers = async options => {
  const finalOptions = {
    ...usersGetConfig,
    ...options,
  };

  const queryParams = queryString.stringify(finalOptions, {
    arrayFormat: 'comma',
  });

  const {
    data: { results },
  } = await axios.get(`${baseUrl}?${queryParams}`);
  return results;
};
