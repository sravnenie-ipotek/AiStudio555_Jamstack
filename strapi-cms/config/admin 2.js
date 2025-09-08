module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7a9c3e5f2b8d1a4e6c9f3b5d8e2a7c4f'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', '9e2f5c8a3d1b7e4f6a9c2d5e8b3f7a1c'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});