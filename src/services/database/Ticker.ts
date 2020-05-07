import { Connection } from './Connection';

export interface Ticker {
  id?: number;
  symbol: string;
  name: string;
  exchange: string;
}

export class Ticker {
  /**
   * Base
   */
  private static table = 'ticker';
  static async list() {
    const connection = await Connection.get();
    const handle = connection<Ticker>(Ticker.table);
    return await handle.select('*');
  }
  static async insert(value: Ticker) {
    if (value.id !== undefined) {
      throw Error('Cannot insert with an id');
    }
    const connection = await Connection.get();
    const handle = connection<Ticker>(Ticker.table);
    return await handle.insert(value);
  }
  static async update(value: Ticker) {
    if (value.id === undefined) {
      throw Error('Cannot update without an id');
    }
    const connection = await Connection.get();
    const handle = connection<Ticker>(Ticker.table);
    return await handle.update(value).where('id', value.id);
  }
  /**
   * Utils
   */
  static async bySymbol() {
    const list = await Ticker.list();
    const mapping = new Map<string, Ticker>();
    for (const item of list) {
      mapping.set(item.symbol, item);
    }
    return mapping;
  }
  static async byId() {
    const list = await Ticker.list();
    const mapping = new Map<number, Ticker>();
    for (const item of list) {
      if (item.id) {
        mapping.set(item.id, item);
      }
    }
    return mapping;
  }
}
