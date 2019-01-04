// Operations on /saleschannels/{id}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');
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

exports.get = (req, reply) => {
  const id = req.params.id;
  const query = knex.select('*')
                    .from('catalogs')
                    .where('id', id)
                    .toString();

  const selectItemsQuery = knex.table('catalog_items')
                    .select('id', 'product_id', 'name', 'default_price', 'sku', 'disabled', 'preview')
                    .where('catalog_id', id)
                    .innerJoin('items', 'catalog_items.item_id', 'items.id')
                    .returning('*')
                    .toString();

  Promise.all([db.query(query), db.query(selectItemsQuery)])
    .spread((catalogResults, itemsResults) => {
      if (!catalogResults[0]) {
        return reply(boom.notFound(`Catalog with id ${id} was not found.`));
      }
      const catalog = catalogResults[0];
      catalog.items = _.map(itemsResults, parseItemPreview);
      return reply(catalog).code(200);
    })
    .catch(() => {
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};

exports.patch = (req, reply) => {
  const catalogId = req.params.id;
  const data = req.payload;
  delete data.id;
  delete data.items;

  const query = knex.table('catalogs')
                    .update(utils.snakeCaseKeys(data))
                    .where('id', catalogId)
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(202);
        return;
      }
      reply(boom.badRequest(`Catalog with id ${catalogId} was not found.`));
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

exports.delete = (req, reply) => {
  const id = req.params.id;
  const query = knex.table('catalogs')
                    .where('id', id)
                    .del()
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(204);
        return;
      }
      reply(boom.badRequest(`Catalog with id ${id} was not found.`));
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
