/* eslint-disable no-console, no-undef */
const hapi = require('hapi');
const swaggerize = require('swaggerize-hapi');
const authJwt = require('hapi-auth-jwt2');
const path = require('path');
const Promise = require('bluebird');

exports.createServer = () => { // eslint-disable-line arrow-body-style
  return new Promise((resolve, reject) => {
    server = new hapi.Server();
    server.connection({});

    const validate = (decoded, request, cb) => cb(null, true);

    server.register(authJwt, (err) => {
      if (err) {
        console.log('authJwt err');
        reject(err);
      }
      server.auth.strategy('jwt', 'jwt',
        {
          key: 'NeverShareYourSecret',
          validateFunc: validate,
          verifyOptions: {
            algorithms: ['HS256'],
          },
        });

      server.register({
        register: swaggerize,
        options: {
          api: path.resolve('./config/swagger.json'),
          handlers: path.resolve('./handlers'),
          docspath: '/swagger',
          cors: true,
        },
      }, (error) => {
        if (error) {
          reject(error);
        }
        resolve(server);
      });
    });
  });
};
