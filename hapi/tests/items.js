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

const data = require('./fixtures/items');

const dataWithIDs = _.map(data, (sc, index) => _.assign({}, sc, {
  id: index + 1,
}));

const createResource = (resourceData) => { // eslint-disable-line arrow-body-style
  return api
    .post('/items')
    .set(defaultHeaders)
    .send(resourceData)
    .expect('Content-Type', /json/)
    .expect(201);
};

test('ITEMS ENDPOINTS', (t) => {
  t.test('POST: /items', (tt) => {
    const validate = validator(apiDef.paths['/items']['post']['responses']['201']['schema']);

    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      _.each(res, (r, index) => {
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, dataWithIDs[index + 10], 'expected respose data');
      });
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'valid respose code and content type');
    }

    function createResourceFin() {
      tt.end();
    }

    Promise.map(data.splice(10, 12), resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('GET: /items', (tt) => {
    api
      .get('/items')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/items']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('GET: /items/{id}', (tt) => {
    api
      .get('/items/1')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/items/{id}']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, dataWithIDs[0], 'expected respose data');
        tt.end();
      });
  });

  t.test('PATCH: /items/{id}', (tt) => {
    const id = 1;
    const resourceUpdates = {
      defaultPrice: _.random(2000, 10000),
      disabled: true,
      name: `updated item name ${id}`,
      preview: {
        img: `updated image string from item ${id}`,
        x: 1,
        y: 1,
        width: 1,
        height: 1,
      },
      editor: {
        border: 0,
        orientation: 'portrait',
        width: 0,
        height: 0,
        bandHeight: 0,
        textSize: 0,
      },
      productId: 1,
      sku: `sku_${id} updated`,
    };
    const expectedResponse = _.assign({}, resourceUpdates, { id });

    api
      .patch(`/items/${id}`)
      .set(defaultHeaders)
      .send(resourceUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end((err, res) => {
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/items/{id}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, expectedResponse, 'expected respose data');
        tt.end();
      });
  });

  // we are only testing deletion of items not associated with any other resource - GABO
  t.test('DELETE: /items/{id}', (tt) => {
    api
      .delete('/items/2')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(204)
      .end((err) => {
        tt.error(err, 'valid respose code and content type');
        tt.end();
      });
  });
});
