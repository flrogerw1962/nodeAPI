// Operations on /catalogs/{id}/items/{itemId}
const db = require('../../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../../lib/utils');
const _ = require('lodash');
const Promise = require('bluebird');

const parseItemPreview = (item) => {
  if (_.isString(item.preview)) {
    return _.assign({}, item, {
      preview: JSON.parse(item.preview),
    });
  }
  return item;
};

exports.patch = (req, reply) => {
  const catalogId = req.params.id;
  const itemId = req.payload.id;
  const entry = utils.snakeCaseKeys({ catalogId, itemId });

  const query = knex.table('catalog_items')
                    .insert(entry)
                    .returning('*')
                    .toString();

  const catalogQuery = knex.select('*')
                    .from('catalogs')
                    .where('id', catalogId)
                    .toString();

  const selectItemsQuery = knex.table('catalog_items')
                    .select('id', 'product_id', 'name', 'default_price', 'sku', 'disabled', 'preview')
                    .where('catalog_id', catalogId)
                    .innerJoin('items', 'catalog_items.item_id', 'items.id')
                    .returning('*')
                    .toString();

  db.query(query)
    .then(() => Promise.all([db.query(catalogQuery), db.query(selectItemsQuery)]))
    .spread((catalogResults, itemsResults) => {
      const catalog = catalogResults[0];
      catalog.items = _.map(itemsResults, parseItemPreview);
      reply(catalog).code(202);
      return;
    })
    .catch((err) => {
      if (err.type === 'dbQueryError') {
        reply(boom.badRequest(err.detail));
        return;
      }
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};
