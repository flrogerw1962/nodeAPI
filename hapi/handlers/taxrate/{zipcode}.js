// Operations on /salesctax/{zipcode}
const db = require('../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../lib/utils');

exports.get = (req, reply) => {
  const zipcode = req.params.zipcode.toString();
  const query = knex.select('*')
                    .from('sales_tax')
                    .where('zipcode', zipcode)
                    .toString();

  const defaultRate = {
    zipcode: req.params.zipcode,
    name: 'No Tax',
    tax: 0,
  };

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(200);
      } else {
        reply(defaultRate).code(200);
      }
      return;
    })
    .catch(() => {
      // TODO : logging - Gabo
      reply(boom.badImplementation());
    });
};
exports.patch = (req, reply) => {
  const zipcode = req.params.zipcode;
  const data = req.payload;
  data.zipcode = zipcode;
  const query = knex.table('sales_tax')
                    .update(utils.snakeCaseKeys(data))
                    .where('zipcode', zipcode)
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(202);
        return;
      }
      reply(boom.badRequest(`Taxrate with zipcode ${zipcode} was not found.`));
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
  const zipcode = req.params.zipcode;
  const query = knex.table('sales_tax')
                    .where('zipcode', zipcode)
                    .del()
                    .returning('*')
                    .toString();

  db.query(query)
    .then((results) => {
      if (results[0]) {
        reply(results[0]).code(204);
        return;
      }
      reply(boom.badRequest(`Taxrate with zipcode ${zipcode} was not found.`));
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
