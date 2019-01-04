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

const priceListsData = require('./fixtures/pricelists');
const itemsData = require('./fixtures/items');

// const priceListItemAttrs = ['id', 'productId', 'sku', 'name', 'defaultPrice', 'price'];
// const cleanItem = item => _.pick(item, priceListItemAttrs);

const itemsWithIDs = _.map(itemsData, (sc, index) => _.assign({}, sc, { id: index + 1 }));
const priceListsWithIDs = _.map(priceListsData, (sc, index) => _.assign({}, sc, { id: index + 1 }));

const data = _.map(priceListsWithIDs, p => _.assign({}, p, { items: _.filter(itemsWithIDs, { productId: p.id }) }));

const createResource = (resourceData) => {  // eslint-disable-line arrow-body-style
  return api
    .post('/pricelists')
    .set(defaultHeaders)
    .send(resourceData)
    .expect('Content-Type', /json/)
    .expect(201);
};

test('PRICE LISTS ENDPOINTS', (t) => {
  t.test('POST: /pricelists', (tt) => {
    const validate = validator(apiDef.paths['/pricelists']['post']['responses']['201']['schema']);

    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      _.each(res, (r, index) => {
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        const expected = _.assign({}, _.omit(priceListsWithIDs[index + 2], ['items'], { items: [] }));
        tt.deepEqual(response, expected, 'expected respose data');
      });
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'valid respose code and content type');
    }

    function createResourceFin() {
      tt.end();
    }

    const resourceDataArr = _.map(priceListsData.splice(2, 4), list => _.pick(list, ['name', 'description']));
    Promise.map(resourceDataArr, resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('GET: /pricelists', (tt) => {
    api
      .get('/pricelists')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/pricelists']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('GET: /pricelists/{id}', (tt) => {
    api
      .get('/pricelists/1')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/pricelists/{id}']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO:  we need to check to items data equality.
        // for now we will remove it
        delete response.items;
        tt.deepEqual(response, _.omit(data[0], ['items']), 'expected respose data');
        tt.end();
      });
  });

  t.test('PATCH: /pricelists/{id}', (tt) => {
    const id = 1;
    const resourceUpdates = {
      name: `updated price list name ${id}`,
      description: `updated price list description ${id}`,
    };

    api
      .patch(`/pricelists/${id}`)
      .set(defaultHeaders)
      .send(resourceUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/pricelists/{id}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(_.omit(response, ['items']), _.assign({}, resourceUpdates, { id }), 'expected respose data');
        tt.end();
      });
  });

  t.test('DELETE: /pricelists/{id}', (tt) => {
    api
      .delete('/pricelists/2')
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
