import { Connection } from './Connection';

export interface Value {
  id?: number;
  ticker_id: number;
  metric_id: number;
  stamp: string;
  value: number;
}

export class Value {
  /**
   * Base
   */
  private static table = 'value';
  static async insert(value: Value) {
    await Connection.insert<Value>(Value.table, value);
  }
  static async insertIgnoreFailure(value: Value) {
    await Connection.insertIgnoreFailure<Value>(Value.table, value);
  }
}
