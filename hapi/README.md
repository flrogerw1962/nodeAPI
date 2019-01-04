# Photo&Go API v2

__work in progress...__

## Architecture

## Directory Structure

## Standards

- https://openapis.org/specification
- http://jsonapi.org/

### General Standards and Guidelines
Read https://github.com/photoandgo/dev-docs for details.

### API Response Standards

The API HTTP responses follow a strict standard.

### HTTP Status Codes

We use a subset of http status codes ( https://httpstatuses.com/ )

- 200 OK – [GET]
- 201 CREATED – [POST]
- 202 ACCEPTED – [PATCH]
- 204 NO CONTENT – [DELETE] ( successful delete action )
- 400 INVALID REQUEST – [POST/PUT/PATCH]
- 401 UNAUTHORIZED
- 403 FORBIDDEN
- 404 NOT FOUND
- 500 INTERNAL SERVER ERROR

#### Success Responses

When requesting a single item the response a JSON object.

Delete on a single item successful response is `no content`, you know it was successful for the HTTP code `204`

Update actions on a single item returns the update item if successful.

When requesting a collection of items the response will always have the following structure
```
{
  results:[],
}
```

#### Unit Test

Running tests `npm test`

Running tests with code coverage `npm run cover`

##### Pagination

__work in progress...__

#### Error Responses ( list of response codes )

All errors reponses will have the following response format
```
{
  "statusCode": "string",
  "code": "string",
  "message": "string"
}
```

- `statusCode` indicates the HTTP code used in the HTTP response  (400, 401, 403, 404, 500)
- `code` indicates the application internal error
- `message` is a human friendly message

We use https://github.com/hapijs/boom to created these HTTP-friendly error objects.

##### 401 vs 403
Whenever a client application receives a 401 response the should be logged out of the interface. This can happen is someone is smart enough to by-pass the client app login screen or if the session has been terminated on the server.
A 403 response simply indicates the logged user doesn't have sufficient permission to perform that action.

## Security

note:  node-pg handles sql injection http://bit.ly/2eEmMtl - Gabo

## Logging

http://hapijs.com/tutorials/logging

## Setup
Read https://github.com/photoandgo/focus-dev for details.

## Development Workflow

Contract First with Swagger.

![](http://bit.ly/2bWgBlQ)

We are currently leveraging the following generator to produce a Hapi.js powered API based on the swagger definition. https://github.com/krakenjs/swaggerize-hapi

## Database Migrations with Flyway

We use flywaydb to manage the database migrations.

#### Migrations Naming Convention

`V<semver>_<description_of_the_migration>.sql`    

Eg: `V1.0.1_drop_order_id_from_cart_items.sql`   

- change mayor when there is big schema change
- change minor whenever you make a small schema modification
- change patch version when you modify a table

more https://flywaydb.org/documentation/migration/sql


## Git Workflow ( github flow )
Read https://github.com/photoandgo/dev-docs/blob/master/CONTRIBUTING.md for details.

## Deployment

## Dev Tooling

## Resources
- [Best Practices for Designing APIs](http://gaboesquivel.com/blog/2015/best-practices-for-designing-web-apis/)
