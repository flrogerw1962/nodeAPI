// Operations on /priceLists/{id}/items/{itemId}
const db = require('../../../lib/db');
const knex = require('knex')({ client: 'pg' });
const boom = require('boom');
const utils = require('../../../lib/utils');
const _ = require('lodash');
const Promise = require('bluebird');

const parseItemPreview = (item) => {
  if (_.isString(item.preview)) {
    return _.assign({}, item, {
      preview: JSON.parse(item.preview),
      editor: JSON.parse(item.editor),
    });
  }
  return item;
};

exports.patch = (req, reply) => {
  console.log('====================');
  console.log(req.payload);

  const { itemId, price, priceListId } = req.payload;
  const entry = utils.snakeCaseKeys({ priceListId, itemId, price });


  const selectQuery = knex.select('*')
                    .from('price_list_items')
                    .where('price_list_id', priceListId)
                    .andWhere('item_id', itemId)
                    .toString();

  const insertQuery = knex.table('price_list_items')
                    .insert(entry)
                    .returning('*')
                    .toString();

  const updateQuery = knex.table('price_list_items')
                    .update({ price: entry.price })
                    .where('item_id', itemId)
                    .andWhere('price_list_id', priceListId)
                    .returning('*')
                    .toString();

  const priceListQuery = knex.select('*')
                    .from('price_lists')
                    .where('id', priceListId)
                    .toString();

  const selectItemsQuery = knex.select('id', 'product_id', 'sku', 'name', 'default_price', 'price')
                        .from('items')
                        .join('price_list_items', 'items.id', 'price_list_items.item_id')
                        .where('price_list_items.price_list_id', priceListId)
                        .toString();


  db.query(selectQuery)
    .then((selectResponse) => {
      const q = (selectResponse.length > 0) ? updateQuery : insertQuery;
      console.log('==========================');
      console.log('==========================');
      console.log('==========================');
      console.log(q);
      return db.query(q);
    })
    .then(() => Promise.all([db.query(priceListQuery), db.query(selectItemsQuery)]))
    .spread((priceListResults, itemsResults) => {
      const priceList = priceListResults[0];
      priceList.items = _.map(itemsResults, parseItemPreview);
      reply(priceList).code(202);
      return;
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
