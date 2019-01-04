// Operations on /catalogs/{id}/items/{itemId}
const db = require('../../../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');

exports.delete = (req, reply) => {
  const catalogId = req.params.id;
  const itemId = req.params.itemId;

  const query = knex.table('catalog_items')
                    .where('item_id', itemId)
                    .andWhere('catalog_id', catalogId)
                    .del()
                    .returning('*')
                    .toString();
  db.query(query)
    .then((results) => {
      if (!results[0]) {
        return reply(boom.badRequest(`Item with id ${itemId} was not found on catalog ${catalogId}.`));
      }
      return reply().code(204);
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
