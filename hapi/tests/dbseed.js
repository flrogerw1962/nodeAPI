/* eslint-disable no-console */
const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },
};

const db = require('../lib/db');
const utils = require('../lib/utils');
const knex = require('knex')(knexConfig);
const Promise = require('bluebird');
const _ = require('lodash');
const saleschannels = require('./fixtures/saleschannels').slice(0, 2);
const users = require('./fixtures/users').slice(0, 2);
const catalogs = require('./fixtures/catalogs').slice(0, 2);
const products = require('./fixtures/products').slice(0, 2);
const pricelists = require('./fixtures/pricelists').slice(0, 2);
const items = require('./fixtures/items').slice(0, 10);
const salestax = require('./fixtures/taxrate').slice(0, 10);

const stringifyItem = item => _.assign({}, item, {
  preview: JSON.stringify(item.preview),
  editor: JSON.stringify(item.editor),
});

const removePlainTextPassword = user => _.omit(user, ['password']);
const priceListItems = _.reduce(pricelists, (itemsArr, list) => _.concat(itemsArr, list.items), []);
const removePriceListItems = list => _.omit(list, ['items']);

// build queries -- the order matters
// we only seed the first 2 items of each fixture collection
const queries = [
  knex('catalogs').insert(utils.snakeCaseKeys(catalogs)).returning('*').toString(),
  knex('products').insert(utils.snakeCaseKeys(products)).returning('*').toString(),
  knex('items').insert(utils.snakeCaseKeys(_.map(items, stringifyItem))).returning('*').toString(),
  knex('users').insert(utils.snakeCaseKeys(_.map(users, removePlainTextPassword))).returning('*').toString(),
  knex('price_lists').insert(utils.snakeCaseKeys(_.map(pricelists, removePriceListItems))).returning('*').toString(),
  knex('price_list_items').insert(utils.snakeCaseKeys(priceListItems)).returning('*').toString(),
  knex('sales_channels').insert(utils.snakeCaseKeys(saleschannels)).returning('*').toString(),
  knex('sales_tax').insert(utils.snakeCaseKeys(salestax)).returning('*').toString(),
];

module.exports = () => {
  console.log('populating test database...');
  return Promise
    .each(queries, query => db.query(query))
    .then(() => console.log('test database seed complete!'))
    .catch(err => console.log(err))
    .finally(() => {
      console.log('closing seed db connection...');
      knex.destroy();
    });
};
