const Mockgen = require('../mockgen.js');
/**
 * Operations on /catalogs/{id}
 */
module.exports = {
  patch: {
    202: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs/{id}',
        operation: 'patch',
        response: '202',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
  get: {
    200: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs/{id}',
        operation: 'get',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  delete: {
    204: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs/{id}',
        operation: 'delete',
        response: '204',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs/{id}',
        operation: 'delete',
        response: 'default',
      }, callback);
    },
  },
};
