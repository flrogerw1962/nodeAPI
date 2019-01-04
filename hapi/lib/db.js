/* eslint-disable no-console*/
const pg = require('pg');
const _ = require('lodash');
const Promise = require('bluebird');
const utils = require('./utils');
const parse = require('pg-connection-string').parse;

let config = {
  max: 50, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

if (process.argv[2] === 'staging' && process.env.STAGING_DB_CONN) {
  const stagingConnConfig = parse(process.env.STAGING_DB_CONN);
  config = _.assign({}, config, stagingConnConfig);
}

const pool = new pg.Pool(config);

pool.on('error', (err, client) => {
  // TODO:  review logging strategy - Gabo
  console.error('IDLE CLIENT ERROR', err.message, err.stack, client);
});

exports.query = (query) => {
  const promise = new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        console.log('CONNECTION ERROR:', err);
        return reject(new Error('database connection error'));
      }

      // note:  node-pg handles sql injection http://bit.ly/2eEmMtl - Gabo
      return client.query(query, (queryError, result) => {
        done(); // review this done() call - Gabo
        if (queryError) {
          // TODO:  review logging strategy - Gabo
          console.log('====> DB QUERY ERROR');
          console.log(queryError);
          queryError.type = 'dbQueryError'; // eslint-disable-line no-param-reassign
          return reject(queryError);
        }

        // TODO: review performance, remove the need for this perhaps, use postgres json functions
        return resolve(_.map(result.rows, row => utils.camelCaseKeys(row)));
      });
    });
  });

  return promise;
};
