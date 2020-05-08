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
    return await Connection.list<Ticker>(Ticker.table);
  }
  static async insert(value: Ticker) {
    await Connection.insert<Ticker>(Ticker.table, value);
  }
  static async update(value: Ticker) {
    await Connection.update<Ticker>(Ticker.table, value);
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
}
