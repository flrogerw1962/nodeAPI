/* eslint-disable dot-notation, max-len */
const apiBaseUrl = `http://localhost:${process.env.PORT || 8000}`;
const test = require('tape');
const _ = require('lodash');
const api = require('supertest-as-promised')(apiBaseUrl);
const validator = require('is-my-json-valid');
const apiDef = require('../config/swagger.json');
const Promise = require('bluebird');

const defaultHeaders = {
  Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkFudGhvbnkgVmFsaWQgVXNlciIsImlhdCI6MTQyNTQ3MzUzNX0.KA68l60mjiC8EXaC2odnjFwdIDxE__iDu5RwLdN1F2A', // eslint-disable-line max-len
  Accept: 'application/json',
};

const data = require('./fixtures/users');

const dataWithIDs = _.map(data, (sc, index) => _.assign({}, sc, {
  id: index + 1,
}));

const createResource = (resourceData) => { // eslint-disable-line arrow-body-style
  return api
    .post('/users')
    .set(defaultHeaders)
    .send(resourceData)
    .expect('Content-Type', /json/)
    .expect(201);
};

test('USERS ENDPOINTS', (t) => {
  t.test('POST: /users', (tt) => {
    const validate = validator(apiDef.paths['/users']['post']['responses']['201']['schema']);

    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      _.each(res, (r, index) => {
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, _.omit(dataWithIDs[index + 2], ['password', 'cryptedPassword']), 'expected respose data');
      });
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'valid respose code and content type');
    }

    function createResourceFin() {
      tt.end();
    }

    const getEmailPass = user => _.omit(user, ['cryptedPassword']);
    const users = data.splice(2, 4);
    const emailPassData = _.map(users, getEmailPass);

    Promise.map(emailPassData, resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('GET: /users', (tt) => {
    api
      .get('/users')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/users']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('GET: /users/{id}', (tt) => {
    api
      .get('/users/1')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/users/{id}']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, _.omit(dataWithIDs[0], ['password', 'cryptedPassword']), 'expected respose data');
        tt.end();
      });
  });

  t.test('PATCH: /users/{id}', (tt) => {
    const id = 1;
    const resourceUpdates = {
      name: `updated user ${id}`,
      email: `updated_user${id}@test.com`,
    };

    api
      .patch(`/users/${id}`)
      .set(defaultHeaders)
      .send(resourceUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/users/{id}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, _.assign({}, resourceUpdates, {
          id,
        }), 'expected respose data');
        tt.end();
      });
  });
});
