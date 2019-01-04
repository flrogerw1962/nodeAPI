// Operations on /items
const db = require('../../lib/db');
const knex = require('knex')({
  client: 'pg',
});
const boom = require('boom');
const _ = require('lodash');
const Promise = require('bluebird');

const formatItems = (pItem) => {
  let item = pItem;

  if (!item.price) {
    item.price = item.defaultPrice;
    delete item.defaultPrice;
  }

  if (_.isString(item.preview)) {
    item = _.assign({}, item, {
      preview: JSON.parse(item.preview),
    });
  }

  if (_.isString(item.editor)) {
    item = _.assign({}, item, {
      editor: JSON.parse(item.editor),
    });
  }
  return item;
};

const getSalesChannel = (salesChannel) => {
  let salesChannelQuery;
  if (parseInt(salesChannel, 10) || 0) {
    salesChannelQuery = knex.select('*')
                                  .from('sales_channels')
                                  .where('id', salesChannel)
                                  .toString();
  } else {
    salesChannelQuery = knex.select('*')
                                  .from('sales_channels')
                                  .where('subdomain', salesChannel)
                                  .toString();
  }
  return db.query(salesChannelQuery);
};

exports.get = (req, reply) => {
  const salesChannelId = req.params.salesChannelId;
  let salesChannel;
  getSalesChannel(salesChannelId)
    .then((results) => {
      salesChannel = results[0];
      if (!salesChannel) {
        return reply(boom.badRequest(`Sales Channel with id ${salesChannelId} was not found.`));
      }

      let itemsQuery;
      let productsQuery;

      // TODO: read data from catalog and price lists, return all products and items for now - Gabo
      delete salesChannel.catalogId;
      if (salesChannel.catalogId) {
        itemsQuery = knex.table('catalog_items')
                          .select('id', 'product_id', 'name', 'default_price', 'sku', 'disabled', 'preview', 'editor')
                          .where('catalog_id', salesChannel.catalogId)
                          .innerJoin('items', 'catalog_items.item_id', 'items.id')
                          .returning('*')
                          .toString();
        productsQuery = knex.table('catalog_items')
                          .select('product.id', 'product.name', 'product.description',
                                  'product.defaultItemId', 'product.optionGroups', 'product.optionItems')
                          .where('catalog_id', salesChannel.catalogId)
                          .andWhere('disabled', false)
                          .innerJoin('items', 'catalog_items.item_id', 'items.id')
                          .innerJoin('product', 'items.product_id', 'product.id')
                          .returning('*')
                          .toString();
      } else {
        itemsQuery = knex.select('*')
                          .from('items')
                          .where('id', '<', 45)  // restrict items for now
                          .toString();
        productsQuery = knex.select('*')
                          .from('products')
                          .where('id', '<', 12)  // restrict products for now
                          .toString();
      }

      return Promise.all([db.query(itemsQuery), db.query(productsQuery)]);
    })
    .spread((items, products) => {
      const appData = {
        config: _.omit(salesChannel, ['catalogId', 'priceListId']),
        products,
        items: _.map(items, formatItems),
      };

      return reply(appData).code(200);
    })
    .catch((err) => {
      console.log(err);
      // TODO : logging - Gabo
      return reply(boom.badImplementation());
    });
};
