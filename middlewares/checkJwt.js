const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const keys = require("../keys");

module.exports = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: keys.jwksURI
  }),
  audience: keys.authAudience,
  issuer: keys.authIssuer,
  algorithms: ["RS256"]
});
