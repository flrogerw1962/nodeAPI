// Operations on /items/{id}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');
const _ = require('lodash');

const stringifyItem = item => _.assign({}, item, {
  preview: JSON.stringify(item.preview),
  editor: JSON.stringify(item.editor),
});

const parseItem = (item) => {
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
  const id = req.params.id;
  const query = knex.select('*')
                    .from('items')
                    .where('id', id)
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(parseItem(results[0])).code(200);
        return;
      }
      reply(boom.notFound(`Item with id ${id} was not found.`));
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
  const query = knex.table('items')
                    .update(utils.snakeCaseKeys(stringifyItem(data)))
                    .where('id', id)
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(parseItem(results[0])).code(202);
        return;
      }
      reply(boom.badRequest(`Item with id ${id} was not found.`));
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
  const query = knex.table('items')
                    .where('id', id)
                    .del()
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(parseItem(results[0])).code(204);
        return;
      }
      reply(boom.badRequest(`Item with id ${id} was not found.`));
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
