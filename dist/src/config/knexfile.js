"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('ts-node/register');
module.exports = {
    client: 'pg',
    connection: {
        user: 'vincent',
        database: 'finn',
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: '../../migrations',
    },
    timezone: 'UTC',
};
exports.default = module.exports;
//# sourceMappingURL=knexfile.js.map