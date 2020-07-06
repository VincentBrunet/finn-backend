import { Connection } from './Connection';

export interface Ticker extends TickerShell {
  id: number;
}
export interface TickerShell {
  exchange_id: number;
  unit_id: number;
  code: string;
  type: string;
  name: string;
  platform: string;
}

export class Ticker {
  /**
   * Base
   */
  private static table = 'ticker';
  static async list(): Promise<Ticker[]> {
    return await Connection.list<Ticker>(Ticker.table);
  }
  static async update(value: Ticker) {
    await Connection.update<Ticker>(Ticker.table, value);
  }
  static async insert(value: TickerShell) {
    await Connection.insert<TickerShell>(Ticker.table, value);
  }
  /**
   * Utils
   */
  static async mapById() {
    const list = await Ticker.list();
    const mapping = new Map<number, Ticker>();
    for (const item of list) {
      mapping.set(item.id, item);
    }
    return mapping;
  }
  static async mapByCode() {
    const list = await Ticker.list();
    const mapping = new Map<string, Ticker>();
    for (const item of list) {
      mapping.set(item.code, item);
    }
    return mapping;
  }
  static async mapBySymbol() {
    const list = await Ticker.list();
    const mapping = new Map<string, Ticker>();
    for (const item of list) {
      mapping.set(item.code.split('.')[0], item);
    }
    return mapping;
  }
}
