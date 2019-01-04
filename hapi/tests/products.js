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

const productsData = require('./fixtures/products');
const itemsData = require('./fixtures/items');

const itemsWithIDs = _.map(itemsData, (sc, index) => _.assign({}, sc, { id: index + 1 }));
const productsWithIDs = _.map(productsData, (sc, index) => _.assign({}, sc, { id: index + 1 }));

const data = _.map(productsWithIDs, p => _.assign({}, p, { items: _.filter(itemsWithIDs, { productId: p.id }) }));

const createResource = (resourceData) => {  // eslint-disable-line arrow-body-style
  return api
    .post('/products')
    .set(defaultHeaders)
    .send(resourceData)
    .expect('Content-Type', /json/)
    .expect(201);
};

test('PRODUCTS ENDPOINTS', (t) => {
  t.test('POST: /products', (tt) => {
    const validate = validator(apiDef.paths['/products']['post']['responses']['201']['schema']);

    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      _.each(res, (r, index) => {
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, productsWithIDs[index + 2], 'expected respose data');
      });
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'valid respose code and content type');
    }

    function createResourceFin() {
      tt.end();
    }

    Promise.map(productsData.splice(2, 4), resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('GET: /products', (tt) => {
    api
      .get('/products')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/products']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('GET: /products/{id}', (tt) => {
    api
      .get('/products/1')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/products/{id}']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO:  we need to check to items data equality.
        // for now we will remove it
        delete response.items;
        delete data[0].items;
        tt.deepEqual(response, data[0], 'expected respose data');
        tt.end();
      });
  });

  t.test('PATCH: /products/{id}', (tt) => {
    const id = 1;
    const resourceUpdates = {
      description: `updated product description ${id}`,
      disabled: true,
      name: `updated product name ${id}`,
      img: '',
      defaultItemId: 2,
      optionGroups: [],
      optionItems: [],
    };

    api
      .patch(`/products/${id}`)
      .set(defaultHeaders)
      .send(resourceUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/products/{id}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        // do not test product.items yet
        delete response.items;
        tt.deepEqual(response, _.assign({}, resourceUpdates, { id }), 'expected respose data');
        tt.end();
      });
  });

  t.test('DELETE: /products/{id}', (tt) => {
    api
      .delete('/products/2')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(204)
      .end(function handleResponse(err) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        tt.end();
      });
  });
});
