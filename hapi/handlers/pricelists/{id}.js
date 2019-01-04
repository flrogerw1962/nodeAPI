// Operations on /saleschannels/{id}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');
const Promise = require('bluebird');


exports.get = (req, reply) => {
  const id = req.params.id;

  const itemsQuery = knex.select('id', 'product_id', 'sku', 'name', 'default_price', 'price')
                        .from('items')
                        .join('price_list_items', 'items.id', 'price_list_items.item_id')
                        .where('price_list_items.price_list_id', id)
                        .toString();

  const query = knex.select('*')
                    .from('price_lists')
                    .where('price_lists.id', id)
                    .toString();

  Promise.all([db.query(query), db.query(itemsQuery)])
    .spread((pricelists, items) => {
      const list = pricelists[0];
      if (list) {
        list.items = items;
        reply(list).code(200);
        return;
      }
      reply(boom.notFound(`Price List with id ${id} was not found.`));
    })
    .catch(() => {
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};

exports.patch = (req, reply) => {
  const id = req.params.id;
  const data = req.payload;
  delete data.id;
  const query = knex.table('price_lists')
                    .update(utils.snakeCaseKeys(data))
                    .where('id', id)
                    .returning('*')
                    .toString();
  const itemsQuery = knex.select('id', 'product_id', 'sku', 'name', 'default_price', 'price')
                        .from('items')
                        .join('price_list_items', 'items.id', 'price_list_items.item_id')
                        .where('price_list_items.price_list_id', id)
                        .toString();

  Promise.all([db.query(query), db.query(itemsQuery)])
    .spread((pricelists, items) => {
      const list = pricelists[0];
      if (list) {
        list.items = items;
        reply(list).code(202);
        return;
      }
      reply(boom.badRequest(`Price List with id ${id} was not found.`));
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
  const query = knex.table('price_lists')
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
      reply(boom.badRequest(`Price List with id ${id} was not found.`));
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
