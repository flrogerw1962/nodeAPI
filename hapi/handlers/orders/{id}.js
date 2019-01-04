const dataProvider = require('../../data/orders/{id}.js');
/**
 * Operations on /orders/{id}
 */
module.exports = {
  patch: (req, reply, next) => {
    const status = 202;
    const provider = dataProvider.patch['202'];
    provider(req, reply, (err, data) => {
      if (err) {
        next(err);
        return;
      }
      reply(data && data.responses).code(status);
    });
  },
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
  delete: (req, reply, next) => {
    const status = 204;
    const provider = dataProvider.delete['204'];
    provider(req, reply, (err, data) => {
      if (err) {
        next(err);
        return;
      }
      reply(data && data.responses).code(status);
    });
  },
};
