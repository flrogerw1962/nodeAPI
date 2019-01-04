const Swagmock = require('swagmock');
const Path = require('path');

const apiPath = Path.resolve(__dirname, '../config/swagger.json');
let mockgen;

module.exports = () => {
  /**
   * Cached mock generator
   */
  mockgen = mockgen || Swagmock(apiPath);
  return mockgen;
};
