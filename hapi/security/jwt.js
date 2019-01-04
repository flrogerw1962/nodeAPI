/**
 * Authorize function for securityDefinitions:jwt
 * type : apiKey
 * description:
 */
module.exports = function authorize(req, res, next) {
  // The context('this') for authorize will be bound to the 'securityDefinition'
  // this.name - The name of the header or query parameter to be used for securityDefinitions:jwt apiKey security scheme.
  // this.in - The location of the API key ("query" or "header") for securityDefinitions:jwt apiKey security scheme.

  // Perform auth here

  next();
};
