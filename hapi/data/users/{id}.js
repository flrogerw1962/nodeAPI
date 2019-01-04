const Mockgen = require('../mockgen.js');
/**
 * Operations on /users/{id}
 */
module.exports = {
  patch: {
    202: (req, res, callback) => {
      Mockgen().responses({
        path: '/users/{id}',
        operation: 'patch',
        response: '202',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
  get: {
    200: (req, res, callback) => {
      Mockgen().responses({
        path: '/users/{id}',
        operation: 'get',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
