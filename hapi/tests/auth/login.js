/* eslint-disable dot-notation, max-len */
const apiBaseUrl = `http://localhost:${process.env.PORT || 8000}`;
const test = require('tape');
const api = require('supertest-as-promised')(apiBaseUrl);
const validator = require('is-my-json-valid');
const apiDef = require('../../config/swagger.json');

test('AUTH ENDPOINTS', (t) => {
  t.test('POST: /auth/login', (tt) => {
    const validate = validator(apiDef.paths['/auth/login']['post']['responses']['200']['schema']);
    const loginData = {
      email: 'string',
      password: 'string',
    };
    function handleResponse(res) { // eslint-disable-line prefer-arrow-callback
      const response = res.body;
      tt.ok(validate(response), 'valid response format');
      return res;
    }

    function handleError(err) { // eslint-disable-line prefer-arrow-callback
      tt.error(err, 'valid respose code and content type');
    }

    return api
      .post('/auth/login')
      .send(loginData)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(handleResponse)
      .catch(handleError)
      .finally(tt.end);
  });
});
