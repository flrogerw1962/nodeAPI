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

const data = require('./fixtures/saleschannels');

const dataWithIDs = _.map(data, (sc, index) => _.assign({}, sc, { id: index + 1 }));

const createResource = resourceData => api.post('/saleschannels')
                                          .set(defaultHeaders)
                                          .send(resourceData)
                                          .expect('Content-Type', /json/)
                                          .expect(201);

test('SALES CHANNELS ENDPOINTS', (t) => {
  t.test('POST: /saleschannels', (tt) => {
    const validate = validator(apiDef.paths['/saleschannels']['post']['responses']['201']['schema']);

    const handleResponse = (res) => {
      _.each(res, (r, index) => {
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, dataWithIDs[index + 2], 'expected respose data');
      });
      return res;
    };

    const handleError = (err) => {
      tt.error(err, 'valid respose code and content type');
    };

    const createResourceFin = () => tt.end();

    Promise.map(data.splice(2, 4), resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('GET: /saleschannels', (tt) => {
    api
      .get('/saleschannels')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/saleschannels']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('GET: /saleschannels/{id}', (tt) => {
    api
      .get('/saleschannels/1')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/saleschannels/{id}']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, dataWithIDs[0], 'expected respose data');
        tt.end();
      });
  });

  t.test('PATCH: /saleschannels/{id}', (tt) => {
    const id = 1;
    const resourceUpdates = {
      name: 'updated test sales channel',
      displayName: 'updated test channel',
      type: 'updated string',
      allowPickup: false,
      allowShip: false,
      web: false,
      store: true,
      subdomain: 'newsubdomain',
      catalogId: 1,
      priceListId: 1,
      disabled: true,
    };

    api
      .patch(`/saleschannels/${id}`)
      .set(defaultHeaders)
      .send(resourceUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end((err, res) => {
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/saleschannels/{id}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        tt.deepEqual(response, _.assign({}, resourceUpdates, { id }), 'expected respose data');
        tt.end();
      });
  });
});
