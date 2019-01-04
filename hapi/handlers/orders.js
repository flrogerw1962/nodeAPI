const dataProvider = require('../data/orders.js');
/**
 * Operations on /orders
 */
module.exports = {
  get: (req, reply, next) => {
    const status = 200;
    const provider = dataProvider.get['200'];
    provider(req, reply, (err, data) => {
      if (err) {
        next(err);
        return;
      }
      reply(data && data.responses).code(status);
    });
  },
  post: (req, reply, next) => {
    const status = 201;
    const provider = dataProvider.post['201'];
    provider(req, reply, (err, data) => {
      if (err) {
        next(err);
        return;
      }
      reply(data && data.responses).code(status);
    });
  },
};
