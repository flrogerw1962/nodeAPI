const _ = require('lodash');
const realData = _.map(require('./data/saleschannels.json'), item => _.omit(item, ['id', 'activaCampaignId']));
const randomBoolean = require('random-boolean');

const getData = (i) => {
  const id = i + 4;
  const data = {
    name: `sales channel ${id}`,
    catalogId: 1,
    allowPickup: randomBoolean(),
    allowShip: randomBoolean(),
    web: randomBoolean(),
    store: randomBoolean(),
    subdomain: `saleschannel${id}`,
    displayName: `sales channel ${id}`,
    disabled: randomBoolean(),
    priceListId: null,
    type: 'the type',
  };
  return data;
};

module.exports = _.concat(realData, _.times(30, getData));
