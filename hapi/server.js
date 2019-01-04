/* eslint-disable no-console */
const hapi = require('hapi');
const hapiPagination = require('hapi-pagination');
const hapiSwaggeredUi = require('hapi-swaggered-ui');
const inert = require('inert');
const swaggerize = require('swaggerize-hapi');
const authJwt = require('hapi-auth-jwt2');
const path = require('path');
const vision = require('vision');

const server = new hapi.Server({
  connections: {
    router: {
    //  stripTrailingSlash: true,
    },
  },
});

server.connection({
  port: process.env.PORT || 8000,
  labels: ['api'],
});

const validate = (decoded, request, cb) => {
  console.log('============ validate ================');
  console.log(decoded);
  console.log('=======================================');
  return cb(null, true);
};

server.register(authJwt, (err) => {
  if (err) {
    console.log('authJwt err');
  }
  server.auth.strategy('jwt', 'jwt',
    {
      key: process.env.JWTSECRET || 'NeverShareYourSecret',
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
  }, () => {
    server.register({
      register: hapiPagination,
      options: {
        query: {
          limit: {
            name: 'limit',
            default: 20,
          },
        },
        routes: {
          include: ['/users', '/products', '/saleschannels', '/orders', '/catalogs', '/items', '/pricelists', '/taxrate'],
          exclude: ['/', '/docs'],
        },
        meta: {
          baseUri: (process.env.HOST) ? `http://${process.env.HOST}` : '/',
          page: {
            active: true,
          },
          limit: {
            active: true,
          },
        },
      },
    },
      (error) => {
        if (error) {
          throw error;
        }
      });

    server.start(() => {
      const host = process.env.HOST || server.info.host;
      server.plugins.swagger.setHost(host); // we asume port 80
      console.log('App running on %s:%d', host);
    });
  });
});

server.register([
  inert,
  vision,
  {
    register: hapiSwaggeredUi,
    options: {
      title: 'API Explorer',
      path: '/explorer',
      swaggerEndpoint: '/swagger',
    },
  }],
  {
    select: 'api',
  },
  (err) => {
    if (err) {
      throw err;
    }
  }
);

server.route({
  path: '/docs/{file*}',
  method: 'GET',
  handler: {
    directory: {
      path: 'docs',
    },
  },
});

server.route({
  path: '/',
  method: 'GET',
  handler: (request, reply) => {
    reply.redirect('/explorer');
  },
});
