
// Operations on /salestax
const db = require('../lib/db');
const knex = require('knex')({
  client: 'pg',
});
const boom = require('boom');
const Promise = require('bluebird');
const utils = require('../lib/utils');

exports.get = (req, reply) => {
  const limit = req.query.limit;
  const offset = limit * (req.query.page - 1);
  const query = knex.select('*')
                    .from('sales_tax')
                    .orderBy('zipcode', 'asc')
                    .offset(offset)
                    .limit(limit)
                    .toString();
  const countQuery = knex.table('sales_tax')
                          .count()
                          .toString();

  Promise.all([db.query(query), db.query(countQuery)])
    .spread((results, countResult) => {
      req.totalCount = parseInt(countResult[0].count, 10); // eslint-disable-line no-param-reassign
      reply({
        results,
      }).code(200);
    })
    .catch(() => {
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};

exports.post = (req, reply) => {
  const data = req.payload;

  const query = knex.table('sales_tax')
                    .insert(utils.snakeCaseKeys(data))
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
