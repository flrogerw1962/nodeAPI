const _ = require('lodash');

const realData = _.map(require('./data/taxrate.json'), item => _.omit(item, ['id']));

module.exports = realData;
