const _ = require('lodash');

const getPriceListItems = (id) => {
  const data = [];

  function getItemId() {
    const itemId = _.random(3, 4);
    if (_.find(data, { itemId })) {
      return getItemId();
    }
    return itemId;
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

  _.times(2, addItem);
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
module.exports = _.times(4, getData);
