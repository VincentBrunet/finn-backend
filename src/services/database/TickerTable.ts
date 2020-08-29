import { Ticker, TickerId, TickerShell } from './../../lib/data/Ticker';
import { Connection } from './Connection';

export class TickerTable {
  /**
   * Base
   */
  private static table = 'ticker';
  static async list(): Promise<Ticker[]> {
    return await Connection.list<Ticker>(TickerTable.table);
  }
  static async update(value: Ticker) {
    await Connection.update<Ticker>(TickerTable.table, value);
  }
  static async insert(value: TickerShell) {
    await Connection.insert<TickerShell>(TickerTable.table, value);
  }
  /**
   * Utils
   */
  static async mapById() {
    const list = await TickerTable.list();
    const mapping = new Map<TickerId, Ticker>();
    for (const item of list) {
      mapping.set(item.id, item);
    }
    return mapping;
  }
  static async mapByCode() {
    const list = await TickerTable.list();
    const mapping = new Map<string, Ticker>();
    for (const item of list) {
      mapping.set(item.code, item);
    }
    return mapping;
  }
}
