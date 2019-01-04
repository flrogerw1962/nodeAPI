/**
 * Operations on /auth/login
 */
module.exports = {
  post: (req, reply) => {
    const status = 200;
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkFudGhvbnkgVmFsaWQgVXNlciIsImlhdCI6MTQyNTQ3MzUzNX0.KA68l60mjiC8EXaC2odnjFwdIDxE__iDu5RwLdN1F2A'; // eslint-disable-line max-len
    reply({
      token,
    }).code(status);
  },
};
