const Mockgen = require('./mockgen.js');
/**
 * Operations on /products
 */
module.exports = {
  get: {
    200: (req, res, callback) => {
      Mockgen().responses({
        path: '/products',
        operation: 'get',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/products',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      Mockgen().responses({
        path: '/products',
        operation: 'post',
        response: '201',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/products',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
