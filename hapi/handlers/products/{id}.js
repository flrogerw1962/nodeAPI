// Operations on /saleschannels/{id}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');
const Promise = require('bluebird');


exports.get = (req, reply) => {
  const id = req.params.id;

  const itemsQuery = knex.select('*')
                        .from('items')
                        .where('product_id', id)
                        .toString();

  const query = knex.select('*')
                    .from('products')
                    .where('products.id', id)
                    .toString();

// TODO: make more performant query .. test
// const query = `SELECT p.id, p.name, array_agg(i) AS items
// FROM products AS p INNER JOIN items AS i ON (p.id = i.product_id)
// GROUP BY p.id`;

  Promise.all([db.query(query), db.query(itemsQuery)])
    .spread((products, items) => {
      const product = products[0];
      if (product) {
        product.items = items;
        reply(product).code(200);
        return;
      }
      reply(boom.notFound(`Product with id ${id} was not found.`));
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
  delete data.items;
  if (data.defaultItemId <= 0) {
    data.defaultItemId = null;
  }
  const productData = data;
  productData.optionGroups = JSON.stringify(data.optionGroups);
  productData.optionItems = JSON.stringify(data.optionItems);

  const itemsQuery = knex.select('*')
                        .from('items')
                        .where('product_id', id)
                        .toString();

  const query = knex.table('products')
                    .update(utils.snakeCaseKeys(productData))
                    .where('id', id)
                    .returning('*')
                    .toString();

  Promise.all([db.query(query), db.query(itemsQuery)])
    .spread((products, items) => {
      const product = products[0];
      if (product) {
        product.items = items;
        reply(product).code(202);
        return;
      }
      reply(boom.notFound(`Product with id ${id} was not found.`));
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
  const query = knex.table('products')
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
      reply(boom.badRequest(`Product with id ${id} was not found.`));
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
