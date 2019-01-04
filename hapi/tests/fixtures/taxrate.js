const _ = require('lodash');

const getData = () => {
  const data = {
    zipcode: _.random(30000, 40000).toString(),
    name: 'FL - State TAX',
    tax: Math.random().toFixed(2),
    disabled: false,
  };
  return data;
};
module.exports = _.times(12, getData);
