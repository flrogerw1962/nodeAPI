const _ = require('lodash');

const getData = (i) => {
  const id = i + 1;
  const data = {
    name: `catalog name ${id}`,
    description: `catalog description ${id}`,
  };
  return data;
};
module.exports = _.times(4, getData);
