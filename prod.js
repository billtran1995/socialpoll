module.exports = {
  mongoURI: procecss.env.MONGO_URI,
  jwksURI: process.env.JWKS_URI,
  authAudience: process.env.AUTH_AUDIENCE,
  authIssuer: process.env.AUTH_ISSUER
};
