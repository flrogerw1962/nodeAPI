
// Operations on /price_list
const db = require('../lib/db');
const knex = require('knex')({
  client: 'pg',
});
const boom = require('boom');
const utils = require('../lib/utils');
const Promise = require('bluebird');
const _ = require('lodash');

exports.get = (req, reply) => {
  const limit = req.query.limit;
  const offset = limit * (req.query.page - 1);
  const countQuery = knex.table('price_lists')
                          .count()
                          .toString();
  const query = knex.select('*')
                    .from('price_lists')
                    .orderBy('id', 'asc')
                    .offset(offset)
                    .limit(limit)
                    .toString();
  const itemsQuery = knex.select('*')
                          .from('items')
                          .join('price_list_items', 'items.id', 'price_list_items.item_id')
                          .toString();

  Promise.all(_.map([query, countQuery, itemsQuery], db.query))
    .spread((pricelists, countResult, items) => {
      const priceListItemAttrs = ['id', 'productId', 'sku', 'name', 'defaultPrice', 'price'];
      const cleanItem = item => _.pick(item, priceListItemAttrs);

      function appendPriceListItems(pricelist) {
        const priceListItems = _.filter(items, { priceListId: pricelist.id });
        pricelist.items = _.map(priceListItems, cleanItem); // eslint-disable-line no-param-reassign
        return pricelist;
      }

      const results = _.map(pricelists, appendPriceListItems);
      req.totalCount = parseInt(countResult[0].count, 10); // eslint-disable-line no-param-reassign
      reply({ results }).code(200);
    })
    .catch(() => {
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};

exports.post = (req, reply) => {
  const id = req.params.id;
  const data = req.payload;
  delete data.id;
  const query = knex.table('price_lists')
    .insert(utils.snakeCaseKeys(data))
    .where('id', id)
    .returning('*')
    .toString();

  db.query(query)
    .then(results => reply(results[0]).code(201))
    .catch((err) => {
      if (err.type === 'dbQueryError') {
        reply(boom.badRequest(err.detail));
        return;
      }
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};
