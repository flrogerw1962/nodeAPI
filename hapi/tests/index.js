/* eslint-disable no-console */
// verify server is running or wait for server to be up
const apiBaseUrl = `http://localhost:${process.env.PORT || 8000}`;
const api = require('supertest')(apiBaseUrl);

const runTests = () => {
  /* eslint-disable global-require */

  // fully implemented endpoints with blackbox testing
  require('./swagger');
  require('./auth/login');
  require('./users');
  require('./products');
  require('./items');
  require('./catalogs');
  require('./pricelists');
  require('./saleschannels');
  require('./taxrate');

  // mocked endpoints with whitebox testing
  require('./orders');
  require('./orders/{id}');
};

let startAttemps = 0;
let testStarted = false;
const start = () => {
  startAttemps += 1;
  console.log(`test start attemp #${startAttemps}`);

  api
    .get('/')
    .then(() => {
      console.log('server is up and running');
      testStarted = true;
      runTests();
    })
    .catch((err) => {
      if (!testStarted && startAttemps <= 5) {
        return setTimeout(() => start(), 1000);
      }
      throw err;
    });
};

const dbseed = require('./dbseed');
// wait 3 seconds to give server some time to start
console.log('waiting for server to boot ...');
setTimeout(() => {
  dbseed()
    .then(start)
    .catch(err => console.log('something went wrong!', err));
}, 5000);
