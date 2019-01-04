const _ = require('lodash');

const getData = (i) => {
  const id = i + 1;
  const data = {
    defaultPrice: _.random(2000, 10000),
    disabled: false,
    name: `item name ${id}`,
    preview: {
      img: `image string from item ${id}`,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    editor: {
      border: 0,
      orientation: 'portrait',
      width: 0,
      height: 0,
      bandHeight: 0,
      textSize: 0,
    },
    productId: 1,
    sku: `sku_${id}`,
  };
  return data;
};
module.exports = _.times(12, getData);
