import { Connection } from './Connection';

export interface Metric extends MetricShell {
  id: number;
}
export interface MetricShell {
  key: string;
  name: string;
  category: string;
  identifier: string;
  period: string;
}

export class Metric {
  /**
   * Base
   */
  private static table = 'metric';
  static async list() {
    return await Connection.list<Metric>(Metric.table);
  }
  static async insert(value: MetricShell) {
    await Connection.insert<MetricShell>(Metric.table, value);
  }
  static async update(value: Metric) {
    await Connection.update<Metric>(Metric.table, value);
  }
  static async insertIgnoreFailure(value: MetricShell) {
    await Connection.insertIgnoreFailure<MetricShell>(Metric.table, value);
  }
  /**
   * Utils
   */
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
  static async byKey() {
    const list = await Metric.list();
    const mapping = new Map<string, Metric>();
    for (const item of list) {
      mapping.set(item.key, item);
    }
    return mapping;
  }
  /**
   * Cache
   */
  private static cache: Map<string, Metric>;
  static async cached(
    key: string,
    name: string,
    category: string,
    identifier: string,
    period: string
  ) {
    if (!Metric.cache) {
      Metric.cache = await Metric.byKey();
    }
    if (!Metric.cache.has(key)) {
      await Metric.insertIgnoreFailure({
        key: key,
        name: name,
        category: category,
        identifier: identifier,
        period: period,
      });
      Metric.cache = await Metric.byKey();
    }
    return Metric.cache.get(key);
  }
}
