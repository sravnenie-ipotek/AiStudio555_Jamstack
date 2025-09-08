module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: false
      },
    },
    debug: false,
    acquireConnectionTimeout: 60000,
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 60000,
      idleTimeoutMillis: 60000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
    }
  },
});