import { Connection } from './Connection';

export interface Metric extends MetricShell {
  id: number;
}
export interface MetricShell {
  name: string;
  category: string;
  period: string;
}

export class Metric {
  /**
   * Base
   */
  private static table = 'metric';
  static async list(): Promise<Metric[]> {
    return await Connection.list<Metric>(Metric.table);
  }
  static async update(value: Metric) {
    await Connection.update<Metric>(Metric.table, value);
  }
  static async insert(value: MetricShell) {
    await Connection.insert<MetricShell>(Metric.table, value);
  }
  static async insertIgnoreFailure(value: MetricShell) {
    await Connection.insertIgnoreFailure<MetricShell>(Metric.table, value);
  }
  static async listForPeriod(period: string) {
    const connection = await Connection.connect();
    const query = connection.select('*').from(Metric.table);
    return await query.where('period', period);
  }
  /**
   * Utils
   */
  static key(metric: MetricShell) {
    return `${metric.name}:${metric.category}:${metric.period}`;
  }
  static async mapById() {
    const list = await Metric.list();
    const mapping = new Map<number, Metric>();
    for (const item of list) {
      if (item.id) {
        mapping.set(item.id, item);
      }
    }
    return mapping;
  }
  static async mapByKey() {
    const list = await Metric.list();
    const mapping = new Map<string, Metric>();
    for (const item of list) {
      mapping.set(Metric.key(item), item);
    }
    return mapping;
  }
  /**
   * Cached lookup
   */
  private static cache: Map<string, Metric>;
  static async lookup(name: string, category: string, period: string) {
    const key = Metric.key({ name, category, period });
    if (!Metric.cache) {
      Metric.cache = await Metric.mapByKey();
    }
    if (!Metric.cache.has(key)) {
      await Metric.insertIgnoreFailure({
        name: name,
        category: category,
        period: period,
      });
      Metric.cache = await Metric.mapByKey();
    }
    return Metric.cache.get(key);
  }
}
