const test = require('tape');
const path = require('path');
const parser = require('swagger-parser');

const apiPath = path.resolve(__dirname, '../config/swagger.json');

test('VALIDATE SWAGGER DEFINITION', (t) => {
  parser.validate(apiPath, (err, api) => {
    t.error(err, 'No parse error');
    t.ok(api, 'Valid swagger api');
    t.end();
  });
});
