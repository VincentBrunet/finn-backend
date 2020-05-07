import { Connection } from './Connection';

export interface Value {
  id?: number;
  ticker_id: number;
  metric_id: number;
  moment: string;
  value: number;
}

export class Value {
  /**
   * Base
   */
  private static table = 'ticker';
  static async insert(value: Value) {
    if (value.id !== undefined) {
      throw Error('Cannot insert with an id');
    }
    const connection = await Connection.get();
    const handle = connection<Value>(Value.table);
    return await handle.insert(value);
  }
}
