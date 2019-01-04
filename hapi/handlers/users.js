
// Operations on /users
const db = require('../lib/db');
const knex = require('knex')({
  client: 'pg',
});
const boom = require('boom');
const utils = require('../lib/utils');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const saltRounds = process.env.SALT_ROUNDS = 10;

exports.get = (req, reply) => {
  const limit = req.query.limit;
  const offset = limit * (req.query.page - 1);
  const query = knex.select('id', 'name', 'email')
    .from('users')
    .offset(offset)
    .limit(limit)
    .toString();
  const countQuery = knex.table('users')
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
  const id = req.params.id;
  const data = req.payload;

  // TODO: remove this line ? ; needs proper sanitization - Gabo
  delete data.id;

  const cryptedPassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(saltRounds));
  const userData = _.assign({}, _.omit(data, ['password']), { cryptedPassword });

  const query = knex.table('users')
    .insert(utils.snakeCaseKeys(userData))
    .where('id', id)
    .returning('*')
    .toString();

  db.query(query)
    .then(results => reply(_.omit(results[0], ['cryptedPassword'])).code(201))
    .catch((err) => {
      if (err.type === 'dbQueryError') {
        reply(boom.badRequest(err.detail));
        return;
      }
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};
