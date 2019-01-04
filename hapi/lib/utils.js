const toSnakeCase = require('snakecase-keys');
const toCamelCase = require('camelcase-keys');
const _ = require('lodash');

exports.camelCaseKeys = (x) => {
  if (_.isArray(x)) {
    return x.map(obj => toCamelCase(obj));
  }
  return toCamelCase(x);
};

exports.snakeCaseKeys = (x) => {
  if (_.isArray(x)) {
    return x.map(obj => toSnakeCase(obj));
  }
  return toSnakeCase(x);
};
