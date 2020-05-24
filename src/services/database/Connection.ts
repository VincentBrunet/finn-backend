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
    const value = await connection.select('*').where('id', id).from(table);
    if (debug) {
      console.log('get', value);
    }
    return value;
  }
  static async list<T extends Model>(table: string) {
    const connection = await Connection.connect();
    const values = await connection.select('*').from(table);
    if (debug) {
      console.log('list', values);
    }
    return values;
  }
  static async update<T extends Model>(table: string, value: T) {
    if (debug) {
      console.log('update', value);
    }
    const connection = await Connection.connect();
    const nerfed: any = value;
    nerfed.id = undefined;
    return await connection.update(nerfed).where('id', value.id).from(table);
  }
  static async insert<T extends ModelShell>(table: string, value: T) {
    if (debug) {
      console.log('insert', value);
    }
    const connection = await Connection.connect();
    return await connection.insert(value).into(table);
  }
  static async insertBatch<T extends ModelShell>(table: string, values: T[]) {
    if (debug) {
      console.log('insert', values);
    }
    const connection = await Connection.connect();
    return connection.batchInsert(table, values, 100);
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
