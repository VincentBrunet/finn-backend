import Knex from 'knex';

import knexfile from '../../config/knexfile';

const debug = false;

export interface ModelShell {}
export interface Model {
  id: number;
}

export class Connection {
  private static knex?: Knex;
  static async connect() {
    if (!Connection.knex) {
      Connection.knex = await Knex(knexfile);
    }
    return Connection.knex;
  }

  /**
   * Base operations
   */
  static async get<T extends Model>(table: string, id: number) {
    const connection = await Connection.connect();
    const handle = connection<T>(table);
    return (await handle.select('*').where('id', id))[0];
  }
  static async list<T extends Model>(table: string) {
    const connection = await Connection.connect();
    const handle = connection<T>(table);
    return await handle.select('*');
  }
  static async insert<T extends ModelShell>(table: string, value: T) {
    const connection = await Connection.connect();
    const handle = connection<T>(table);
    if (debug) {
      console.log('insert', value);
    }
    await handle.insert(value);
  }
  static async update<T extends Model>(table: string, value: T) {
    const connection = await Connection.connect();
    const handle = connection<T>(table);
    if (debug) {
      console.log('update', value);
    }
    await handle.update(value).where('id', value.id);
  }

  /**
   * Base operations wrappers
   */
  static async insertIgnoreFailure<T extends ModelShell>(table: string, value: T) {
    try {
      await Connection.insert(table, value);
    } catch (e) {}
  }
}
