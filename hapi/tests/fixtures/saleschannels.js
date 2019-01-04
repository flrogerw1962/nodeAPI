const _ = require('lodash');
const converter = require('number-to-words');

const getData = (i) => {
  const id = i + 1;
  const data = {
    name: `sales channel ${id}`,
    catalogId: 1,
    allowPickup: true,
    allowShip: true,
    web: Boolean(i % 2),
    store: Boolean(!i % 2),
    subdomain: converter.toWords(id).replace(/ /ig, '-'),
    displayName: `sales channel ${id}`,
    disabled: true,
    priceListId: 1,
    type: 'the type',
  };
  return data;
};


module.exports = _.times(4, getData);
