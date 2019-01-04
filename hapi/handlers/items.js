// Operations on /items
const db = require('../lib/db');
const knex = require('knex')({
  client: 'pg',
});
const boom = require('boom');
const utils = require('../lib/utils');
const _ = require('lodash');
const Promise = require('bluebird');

const stringifyItem = item => _.assign({}, item, {
  preview: JSON.stringify(item.preview),
  editor: JSON.stringify(item.editor),
});

const parseItemPreview = (item) => {
  if (_.isString(item.preview)) {
    return _.assign({}, item, {
      preview: JSON.parse(item.preview),
    });
  }
  if (_.isString(item.editor)) {
    return _.assign({}, item, {
      editor: JSON.parse(item.editor),
    });
  }
  return item;
};

exports.get = (req, reply) => {
  const limit = req.query.limit;
  const productId = req.query.productId;
  const where = {};
  if (productId) {
    where.productId = productId;
  }
  const snakeWhere = utils.snakeCaseKeys(where);
  const offset = limit * (req.query.page - 1);
  const countQuery = knex.table('items')
                        .where(snakeWhere)
                        .count()
                        .toString();
  const query = knex.select('*')
                    .from('items')
                    .where(snakeWhere)
                    .orderBy('id', 'asc')
                    .offset(offset)
                    .limit(limit)
                    .toString();

  Promise.all([db.query(query), db.query(countQuery)])
    .spread((results, countResult) => {
      req.totalCount = parseInt(countResult[0].count, 10); // eslint-disable-line no-param-reassign
      const r = _.map(results, parseItemPreview);
      reply({
        results: r,
      }).code(200);
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
  const query = knex.table('items')
                    .insert(utils.snakeCaseKeys(stringifyItem(data)))
                    .where('id', id)
                    .returning('*')
                    .toString();

  db.query(query)
    .then(results => reply(parseItemPreview(results[0])).code(201))
    .catch((err) => {
      if (err.type === 'dbQueryError') {
        reply(boom.badRequest(err.detail));
        return;
      }
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};
