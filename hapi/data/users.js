const Mockgen = require('./mockgen.js');
/**
 * Operations on /users
 */
module.exports = {
  get: {
    200: (req, res, callback) => {
      Mockgen().responses({
        path: '/users',
        operation: 'get',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      Mockgen().responses({
        path: '/users',
        operation: 'post',
        response: '201',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
