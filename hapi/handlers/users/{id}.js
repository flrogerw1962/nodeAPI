// Operations on /saleschannels/{id}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const saltRounds = process.env.SALT_ROUNDS = 10;

exports.get = (req, reply) => {
  const id = req.params.id;
  const query = knex.select('id', 'name', 'email')
                    .from('users')
                    .where('id', id)
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(200);
        return;
      }
      reply(boom.notFound(`User with id ${id} was not found.`));
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
  let userData = data;

  if (data.password) {
    const cryptedPassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(saltRounds));
    userData = _.assign({}, _.omit(data, ['password']), { cryptedPassword });
  }

  const query = knex.table('users')
                    .update(utils.snakeCaseKeys(userData))
                    .where('id', id)
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(_.omit(results[0], ['cryptedPassword'])).code(202);
        return;
      }
      reply(boom.badRequest(`User with id ${id} was not found.`));
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
