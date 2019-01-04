
// Operations on /saleschannels
const db = require('../lib/db');
const knex = require('knex')({
  client: 'pg',
});
const boom = require('boom');
const utils = require('../lib/utils');
const Promise = require('bluebird');
const _ = require('lodash');

const stringifyProductJsonFields = product => _.assign({}, product, {
  optionItems: JSON.stringify(product.optionItems || []),
  optionGroups: JSON.stringify(product.optionGroups || []),
});

const parseItemPreview = (item) => {
  if (_.isString(item.preview)) {
    return _.assign({}, item, {
      preview: JSON.parse(item.preview),
    });
  }
  return item;
};

exports.get = (req, reply) => {
  const limit = req.query.limit;
  const offset = limit * (req.query.page - 1);
  const countQuery = knex.table('products')
                          .count()
                          .toString();

  const itemsQuery = knex.select('*')
    .from('items')
    .toString();

  const query = knex.select('*')
                    .from('products')
                    .orderBy('id', 'asc')
                    .offset(offset)
                    .limit(limit)
                    .toString();

  Promise.all([db.query(query), db.query(itemsQuery), db.query(countQuery)])
    .spread((products, items, countResult) => {
      req.totalCount = parseInt(countResult[0].count, 10); // eslint-disable-line no-param-reassign
      // inlude items in for each product
      const results = _.map(products, p => _.assign({}, p, { items: _.map(_.filter(items, { productId: p.id }), parseItemPreview) })); // eslint-disable-line max-len
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
  delete data.items;
  if (data.defaultItemId <= 0) {
    delete data.defaultItemId;
  }
  const insertData = utils.snakeCaseKeys(stringifyProductJsonFields(data));
  const query = knex.table('products')
    .insert(insertData)
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
