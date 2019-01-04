// Operations on /saleschannels/{id}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');


exports.get = (req, reply) => {
  const id = req.params.id;
  const query = knex.select('*')
                    .from('sales_channels')
                    .where('id', id)
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(200);
        return;
      }
      reply(boom.notFound(`Sales Channel with id ${id} was not found.`));
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
  data.catalogId = (data.catalogId === 0) ? null : data.catalogId;
  data.priceListId = (data.priceListId === 0) ? null : data.priceListId;

  const query = knex.table('sales_channels')
                    .update(utils.snakeCaseKeys(data))
                    .where('id', id)
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(202);
        return;
      }
      reply(boom.badRequest(`Sales Channel with id ${id} was not found.`));
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
