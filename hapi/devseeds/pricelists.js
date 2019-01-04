const _ = require('lodash');

const getPriceListItems = (id) => {
  const data = [];
  let itemCount = 0;
  function getItemId() {
    itemCount += 1;
    return itemCount;
  }

  function addItem() {
    const itemId = getItemId();
    const price = _.random(2000, 10000);
    data.push({
      priceListId: id,
      itemId,
      price,
    });
  }

  _.times(30, addItem);
  return data;
};

const getData = (i) => {
  const id = i + 1;
  const data = {
    name: `price list name ${id}`,
    description: `price list description ${id}`,
    items: getPriceListItems(id),
  };
  return data;
};
module.exports = _.times(30, getData);
