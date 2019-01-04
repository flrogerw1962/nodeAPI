/* eslint-disable no-console */

const db = require('../lib/db');
const utils = require('../lib/utils');
const Promise = require('bluebird');
const _ = require('lodash');
const knex = require('knex')({ client: 'pg' });
const saleschannels = require('./saleschannels');
const catalogs = require('./catalogs');
const pricelists = require('./pricelists');
const products = require('./products');
const items = require('./items');
const users = require('./users');
const salestax = require('./taxrate');

const priceListItems = _.reduce(pricelists, (itemsArr, list) => _.concat(itemsArr, list.items), []);

const stringifyItem = item => _.assign({}, item, {
  preview: JSON.stringify(item.preview),
  editor: JSON.stringify(item.editor),
});

const removePlainTextPassword = user => _.omit(user, ['password']);
const removePriceListItems = list => _.omit(list, ['items']);

// build queries -- the order matters ( foreign keys )
const queries = [
  knex('users').insert(utils.snakeCaseKeys(_.map(users, removePlainTextPassword))).returning('*').toString(),
  knex('products').insert(utils.snakeCaseKeys(products)).returning('*').toString(),
  knex('items').insert(utils.snakeCaseKeys(_.map(items, stringifyItem))).returning('*').toString(),
  knex('price_lists').insert(utils.snakeCaseKeys(_.map(pricelists, removePriceListItems))).returning('*').toString(),
  knex('price_list_items').insert(utils.snakeCaseKeys(priceListItems)).returning('*').toString(),
  knex('catalogs').insert(utils.snakeCaseKeys(catalogs)).returning('*').toString(),
  knex('sales_channels').insert(utils.snakeCaseKeys(saleschannels)).returning('*').toString(),
  knex('sales_tax').insert(utils.snakeCaseKeys(salestax)).returning('*').toString(),
];

Promise.each(queries, query => db.query(query))
.then(() => console.log('dev seed complete!'))
.catch(err => console.log(err))
.finally(() => {
  knex.destroy();
  process.exit(0);
});
