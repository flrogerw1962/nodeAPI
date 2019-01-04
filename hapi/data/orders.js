const Mockgen = require('./mockgen.js');
/**
 * Operations on /orders
 */
module.exports = {
  get: {
    200: (req, res, callback) => {
      Mockgen().responses({
        path: '/orders',
        operation: 'get',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/orders',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      Mockgen().responses({
        path: '/orders',
        operation: 'post',
        response: '201',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/orders',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
