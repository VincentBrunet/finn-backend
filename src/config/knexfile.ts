require('ts-node/register');

module.exports = {
  client: 'pg',
  connection: {
    user: 'othervincent',
    password: '',
    database: 'finn',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './../../migrations',
  },
  timezone: 'UTC',
};

export default module.exports;
