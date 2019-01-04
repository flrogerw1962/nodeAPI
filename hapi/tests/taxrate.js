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
const data = require('./fixtures/taxrate');

//  const dataWithIDs = _.map(data, (sc, index) => _.assign({}, sc, { id: index + 1 }));
const createResource = (resourceData) => { // eslint-disable-line arrow-body-style
  return api
    .get(`/taxrate/${resourceData.zipcode}`)
    .set(defaultHeaders)
    .expect('Content-Type', /json/)
    .expect(200);
};

test('TAXRATE ENDPOINTS', (t) => {
  t.test('POST: /taxrate', (tt) => {
    const validate = validator(apiDef.paths['/taxrate']['post']['responses']['201']['schema']);

    const handleResponse = (res) => {
      _.each(res, (r, index) => { // eslint-disable-line no-unused-vars
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response, dataWithIDs[index + 2], 'expected respose data');
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
  t.test('GET: /taxrate', (tt) => {
    api
      .get('/taxrate')
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function handleResponse(err, res) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/taxrate']['get']['responses']['200']['schema']);
        tt.ok(validate(response), 'valid response format');
        // TODO: tt.deepEqual(response.results, expectedResults);
        tt.end();
      });
  });

  t.test('PATCH: /taxrate/{zipcode}', (tt) => {
    const zip = data[0].zipcode;
    const resourceUpdates = {
      zipcode: zip,
      name: 'updated test taxrate',
      tax: 0.0009,
      disabled: true,
    };

    api
      .patch(`/taxrate/${zip}`)
      .set(defaultHeaders)
      .send(resourceUpdates)
      .expect('Content-Type', /json/)
      .expect(202)
      .end((err, res) => {
        tt.error(err, 'valid respose code and content type');
        const response = res.body;
        const validate = validator(apiDef.paths['/taxrate/{zipcode}']['patch']['responses']['202']['schema']);
        tt.ok(validate(response), 'valid response format');
        // tt.deepEqual(response, _.assign({}, resourceUpdates, { id }), 'expected respose data');
        tt.end();
      });
  });

  t.test('GET: /taxrate/{zipcode}', (tt) => {
    const validate = validator(apiDef.paths['/taxrate/{zipcode}']['get']['responses']['200']['schema']);

    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      _.each(res, (r, index) => { // eslint-disable-line no-unused-vars
        const response = r.body;
        tt.ok(validate(response), 'valid response format');
        //  tt.deepEqual(response, dataWithIDs[index + 2], 'expected respose data');
      });
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'invalid respose code and/or content type');
    }

    function createResourceFin() {
      tt.end();
    }

    Promise.map(data, resourceData => createResource(resourceData))
      .then(handleResponse)
      .catch(handleError)
      .finally(createResourceFin);
  });

  t.test('DELETE: /taxrate/{zipcode}', (tt) => {
    const zip = data[0].zipcode;
    api
      .delete(`/taxrate/${zip}`)
      .set(defaultHeaders)
      .expect('Content-Type', /json/)
      .expect(204)
      .end(function handleResponse(err) { // eslint-disable-line prefer-arrow-callback
        tt.error(err, 'valid respose code and content type');
        tt.end();
      });
  });
});
