const _ = require('lodash');
const bcrypt = require('bcrypt');

const saltRounds = process.env.SALT_ROUNDS = 10;
const getData = (i) => {
  const id = i + 1;
  const data = {
    name: `user ${id}`,
    email: `user${id}@test.com`,
    password: `user${id}`,
    cryptedPassword: bcrypt.hashSync(`user${id}`, saltRounds),
  };
  return data;
};

module.exports = _.times(4, getData);
