
// Operations on /catalogs
const db = require('../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../lib/utils');
const Promise = require('bluebird');

exports.get = (req, reply) => {
  const limit = req.query.limit;
  const offset = limit * (req.query.page - 1);
  const countQuery = knex.table('catalogs')
                          .count()
                          .toString();
  const query = knex.select('*')
                    .from('catalogs')
                    .orderBy('id', 'asc')
                    .offset(offset)
                    .limit(limit)
                    .toString();

  Promise.all([db.query(query), db.query(countQuery)])
    .spread((results, countResult) => {
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
  const query = knex.table('catalogs')
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
