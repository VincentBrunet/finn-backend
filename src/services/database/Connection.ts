import Knex from 'knex';

import knexfile from '../../config/knexfile';

export class Connection {
  private static knex?: Knex;
  static async get() {
    if (!Connection.knex) {
      Connection.knex = await Knex(knexfile);
    }
    return Connection.knex;
  }
}
