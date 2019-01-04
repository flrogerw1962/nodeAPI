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

const data = require('./fixtures/catalogs');

const dataWithIDs = _.map(data, (sc, index) => _.assign({}, sc, { id: index + 1 }));

const createResource = (resourceData) => {  // eslint-disable-line arrow-body-style
  return api
    .post('/catalogs')
    .set(defaultHeaders)
    .send(resourceData)
    .expect('Content-Type', /json/)
    .expect(201);
};

test('CATALOGS ENDPOINTS', (t) => {
  t.test('POST: /catalogs', (tt) => {
    const validate = validator(apiDef.paths['/catalogs']['post']['responses']['201']['schema']);

    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      _.each(res, (r, index) => {
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, dataWithIDs[index + 2], 'expected respose data');
      });
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'valid respose code and content type');
    }

    function createResourceFin() {
      tt.end();
    }

    Promise.map(data.splice(2, 4), resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('GET: /catalogs', (tt) => {
    api
      .get('/catalogs')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/catalogs']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('GET: /catalogs/{id}', (tt) => {
    api
      .get('/catalogs/1')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/catalogs/{id}']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO:  we need to check to items data equality.
        // for now we will remove it
        delete response.items;
        tt.deepEqual(response, dataWithIDs[0], 'expected respose data');
        tt.end();
      });
  });

  t.test('PATCH: /catalogs/{id}', (tt) => {
    const id = 1;
    const catalogUpdates = {
      name: 'updated catalog',
      description: 'updated catalog description',
    };

    api
      .patch(`/catalogs/${id}`)
      .set(defaultHeaders)
      .send(catalogUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/catalogs/{id}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, _.assign({}, catalogUpdates, { id }), 'expected respose data');
        tt.end();
      });
  });

  // we are only testing deletion of catalog not associated with any sales channel - GABO
  t.test('DELETE: /catalogs/{id}', (tt) => {
    api
      .delete('/catalogs/2')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(204)
      .end(function handleResponse(err) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        tt.end();
      });
  });
});

// TODO: add tests for  /items endpoints
