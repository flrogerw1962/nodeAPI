const Mockgen = require('./mockgen.js');
/**
 * Operations on /catalogs
 */
module.exports = {
  get: {
    200: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs',
        operation: 'get',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/catalogs',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/catalogs',
        operation: 'post',
        response: '201',
      }, callback);
    },
    default: (req, res, callback) => {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/catalogs',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
