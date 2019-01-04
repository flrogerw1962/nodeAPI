const _ = require('lodash');
const realProducts = require('./data/products.json');

const realData = _.map(realProducts, (pItem) => {
  const item = _.omit(pItem, ['id']);
  item.optionItems = JSON.stringify(item.optionItems);
  item.optionGroups = JSON.stringify(item.optionGroups);
  return item;
});

const getData = (i) => {
  const id = i + 11;
  const data = {
    description: `product description ${id}`,
    disabled: true,
    name: `product name ${id}`,
    defaultItemId: 1,
    img: 'string',
    optionItems: JSON.stringify([]),
    optionGroups: JSON.stringify([]),
  };
  return data;
};

module.exports = _.concat(realData, _.times(30, getData));
