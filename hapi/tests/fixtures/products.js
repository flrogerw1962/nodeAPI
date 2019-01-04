const _ = require('lodash');

const getData = (i) => {
  const id = i + 1;
  const data = {
    description: `product description ${id}`,
    disabled: false,
    name: `product name ${id}`,
    img: '',
    defaultItemId: 1,
    optionGroups: [],
    optionItems: [],
  };
  return data;
};

module.exports = _.times(4, getData);
