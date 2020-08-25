import { Exchange, ExchangeShell } from '../../lib/data/Exchange';
import { Connection } from './Connection';

export class ExchangeTable {
  /**
   * Base
   */
  private static table = 'exchange';
  static async list(): Promise<Exchange[]> {
    return await Connection.list<Exchange>(ExchangeTable.table);
  }
  static async update(value: Exchange) {
    await Connection.update<Exchange>(ExchangeTable.table, value);
  }
  static async insert(value: ExchangeShell) {
    await Connection.insert<ExchangeShell>(ExchangeTable.table, value);
  }
  /**
   * Utils
   */
  static async mapById() {
    const list = await ExchangeTable.list();
    const mapping = new Map<number, Exchange>();
    for (const item of list) {
      mapping.set(item.id, item);
    }
    return mapping;
  }
  static async mapByCode() {
    const list = await ExchangeTable.list();
    const mapping = new Map<string, Exchange>();
    for (const item of list) {
      mapping.set(item.code, item);
    }
    return mapping;
  }
}
