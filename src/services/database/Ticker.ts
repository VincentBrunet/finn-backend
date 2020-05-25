import { Connection } from './Connection';

export interface Ticker extends TickerShell {
  id: number;
}
export interface TickerShell {
  code: string;
  name?: string;
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
  static async mapByCode() {
    const list = await Ticker.list();
    const mapping = new Map<string, Ticker>();
    for (const item of list) {
      mapping.set(item.code, item);
    }
    return mapping;
  }
}
