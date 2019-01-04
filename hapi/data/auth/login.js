const Mockgen = require('../mockgen.js');
/**
 * Operations on /auth/login
 */
module.exports = {
  post: {
    200: (req, res, callback) => {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/auth/login',
        operation: 'post',
        response: '200',
      }, callback);
    },
    default: (req, res, callback) => {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/auth/login',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
