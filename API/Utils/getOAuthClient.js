const { OAuth2Client } = require("google-auth-library");

const getOAuthClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth credentials.");
  }

  return new OAuth2Client(clientId, clientSecret, "postmessage");
};

module.exports = getOAuthClient;
