import { Connection } from './Connection';

export interface Metric {
  id?: number;
  name: string;
  category: string;
}

export class Metric {
  /**
   * Base
   */
  private static table = 'metric';
  static async list() {
    const connection = await Connection.get();
    const handle = connection<Metric>(Metric.table);
    return await handle.select('*');
  }
  static async insert(value: Metric) {
    if (value.id !== undefined) {
      throw Error('Cannot insert with an id');
    }
    const connection = await Connection.get();
    const handle = connection<Metric>(Metric.table);
    return await handle.insert(value);
  }
  static async update(value: Metric) {
    if (value.id === undefined) {
      throw Error('Cannot update without an id');
    }
    const connection = await Connection.get();
    const handle = connection<Metric>(Metric.table);
    return await handle.update(value).where('id', value.id);
  }
  /**
   * Utils
   */
  static async byName() {
    const list = await Metric.list();
    const mapping = new Map<string, Metric>();
    for (const item of list) {
      mapping.set(item.name, item);
    }
    return mapping;
  }
  static async byId() {
    const list = await Metric.list();
    const mapping = new Map<number, Metric>();
    for (const item of list) {
      if (item.id) {
        mapping.set(item.id, item);
      }
    }
    return mapping;
  }
}
