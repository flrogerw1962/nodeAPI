/* eslint-disable dot-notation, max-len */
const Test = require('tape');
const Hapi = require('hapi');
const Path = require('path');
const Mockgen = require('../../data/mockgen.js');
const Parser = require('swagger-parser');
const testingServer = require('../testingServer');
const Validator = require('is-my-json-valid');
/**
 * Test for /orders/{id}
 */
Test('/orders/{id}', (t) => {
  const apiPath = Path.resolve(__dirname, '../../config/swagger.json');
  let server;

  Parser.validate(apiPath, (err, api) => {
    t.error(err, 'No parse error');
    t.ok(api, 'Valid swagger api');
    t.test('server', (tt) => {
      tt.plan(1);
      server = new Hapi.Server();
      server.connection({});
      testingServer
        .createServer()
        .then((s) => {
          server = s;
          tt.pass('No error.');
        })
        .catch((error) => {
          tt.error(error);
        });
    });
    t.test('test  patch operation', (tt) => {
      Mockgen().requests({
        path: '/orders/{id}',
        operation: 'patch',
      }, (error, mock) => {
        const options = {
          method: 'patch',
          url: `${mock.request.path}`,
        };
        tt.error(error);
        tt.ok(mock);
        tt.ok(mock.request);
        if (mock.request.body) {
          // Send the request body
          options.payload = mock.request.body;
        } else if (mock.request.formData) {
          // Send the request form data
          options.payload = mock.request.formData;
          // Set the Content-Type as application/x-www-form-urlencoded
          options.headers = options.headers || {};
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        // If headers are present, set the headers.
        if (mock.request.headers && mock.request.headers.length > 0) {
          options.headers = mock.request.headers;
        }
        server.inject(options, (res) => {
          tt.ok(res.statusCode === 202, 'Ok response status');
          const validate = Validator(api.paths['/orders/{id}']['patch']['responses']['202']['schema']);
          tt.ok(validate(res.result || res.payload), 'Valid response');
          tt.error(validate.errors, 'No validation errors');
          tt.end();
        });
      });
    });
    t.test('test  get operation', (tt) => {
      Mockgen().requests({
        path: '/orders/{id}',
        operation: 'get',
      }, (error, mock) => {
        const options = {
          method: 'get',
          url: `${mock.request.path}`,
        };
        tt.error(error);
        tt.ok(mock);
        tt.ok(mock.request);
        if (mock.request.body) {
          // Send the request body
          options.payload = mock.request.body;
        } else if (mock.request.formData) {
          // Send the request form data
          options.payload = mock.request.formData;
          // Set the Content-Type as application/x-www-form-urlencoded
          options.headers = options.headers || {};
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        // If headers are present, set the headers.
        if (mock.request.headers && mock.request.headers.length > 0) {
          options.headers = mock.request.headers;
        }
        server.inject(options, (res) => {
          tt.ok(res.statusCode === 200, 'Ok response status');
          const validate = Validator(api.paths['/orders/{id}']['get']['responses']['200']['schema']);
          tt.ok(validate(res.result || res.payload), 'Valid response');
          tt.error(validate.errors, 'No validation errors');
          tt.end();
        });
      });
    });
    t.test('test  delete operation', (tt) => {
      Mockgen().requests({
        path: '/orders/{id}',
        operation: 'delete',
      }, (error, mock) => {
        const options = {
          method: 'delete',
          url: `${mock.request.path}`,
          headers: {
            Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkFudGhvbnkgVmFsaWQgVXNlciIsImlhdCI6MTQyNTQ3MzUzNX0.KA68l60mjiC8EXaC2odnjFwdIDxE__iDu5RwLdN1F2A',
          },
        };
        tt.error(error);
        tt.ok(mock);
        tt.ok(mock.request);
        if (mock.request.body) {
          // Send the request body
          options.payload = mock.request.body;
        } else if (mock.request.formData) {
          // Send the request form data
          options.payload = mock.request.formData;
          // Set the Content-Type as application/x-www-form-urlencoded
          options.headers = options.headers || {};
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        // If headers are present, set the headers.
        if (mock.request.headers && mock.request.headers.length > 0) {
          options.headers = mock.request.headers;
        }
        server.inject(options, (res) => {
          tt.ok(res.statusCode === 204, 'Ok response status');
          tt.end();
        });
      });
    });
  });
});
