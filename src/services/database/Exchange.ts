import { Connection } from './Connection';

export interface Exchange extends ExchangeShell {
  id: number;
}
export interface ExchangeShell {
  unit_id: number;
  code: string;
  name: string;
  country: string;
}

export class Exchange {
  /**
   * Base
   */
  private static table = 'exchange';
  static async list(): Promise<Exchange[]> {
    return await Connection.list<Exchange>(Exchange.table);
  }
  static async update(value: Exchange) {
    await Connection.update<Exchange>(Exchange.table, value);
  }
  static async insert(value: ExchangeShell) {
    await Connection.insert<ExchangeShell>(Exchange.table, value);
  }
  /**
   * Utils
   */
  static async mapById() {
    const list = await Exchange.list();
    const mapping = new Map<number, Exchange>();
    for (const item of list) {
      mapping.set(item.id, item);
    }
    return mapping;
  }
  static async mapByCode() {
    const list = await Exchange.list();
    const mapping = new Map<string, Exchange>();
    for (const item of list) {
      mapping.set(item.code, item);
    }
    return mapping;
  }
}
