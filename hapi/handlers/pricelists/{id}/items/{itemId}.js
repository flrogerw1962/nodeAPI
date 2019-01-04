// Operations on /priceLists/{id}/items/{itemId}
const db = require('../../../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');

exports.delete = (req, reply) => {
  const priceListId = req.params.id;
  const itemId = req.params.itemId;

  const query = knex.table('price_lists_items')
                    .where('item_id', itemId)
                    .andWhere('price_list_id', priceListId)
                    .del()
                    .returning('*')
                    .toString();
  db.query(query)
    .then((results) => {
      if (!results[0]) {
        return reply(boom.badRequest(`Item with id ${itemId} was not found on price list ${priceListId}.`));
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
