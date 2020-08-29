import {
  Metric,
  MetricCategory,
  MetricName,
  MetricPeriod,
  MetricShell,
} from '../../lib/data/Metric';
import { Connection } from './Connection';
import { ErrorDatabase } from './ErrorDatabase';

export class MetricTable {
  /**
   * Base
   */
  private static table = 'metric';
  static async list(): Promise<Metric[]> {
    return await Connection.list<Metric>(MetricTable.table);
  }
  static async update(value: Metric) {
    await Connection.update<Metric>(MetricTable.table, value);
  }
  static async insert(value: MetricShell) {
    await Connection.insert<MetricShell>(MetricTable.table, value);
  }
  static async insertIgnoreFailure(value: MetricShell) {
    await Connection.insertIgnoreFailure<MetricShell>(MetricTable.table, value);
  }
  /**
   * Filtered reading
   */
  static async listForPeriod(period: MetricPeriod) {
    const connection = await Connection.connect();
    const query = connection.select('*').from(MetricTable.table);
    return await query.where('period', period);
  }
  /**
   * Utils
   */
  static key(metric: MetricShell) {
    return `${metric.name}:${metric.category}:${metric.period}`;
  }
  static async mapById() {
    const list = await MetricTable.list();
    const mapping = new Map<number, Metric>();
    for (const item of list) {
      if (item.id) {
        mapping.set(item.id, item);
      }
    }
    return mapping;
  }
  static async mapByKey() {
    const list = await MetricTable.list();
    const mapping = new Map<string, Metric>();
    for (const item of list) {
      mapping.set(MetricTable.key(item), item);
    }
    return mapping;
  }
  /**
   * Cached lookup
   */
  private static cache: Map<string, Metric>;
  static async lookup(name: MetricName, category: MetricCategory, period: MetricPeriod) {
    const key = MetricTable.key({ name, category, period });
    if (!MetricTable.cache) {
      MetricTable.cache = await MetricTable.mapByKey();
    }
    const cached = MetricTable.cache.get(key);
    if (cached) {
      return cached;
    }
    await MetricTable.insertIgnoreFailure({
      name: name,
      category: category,
      period: period,
    });
    MetricTable.cache = await MetricTable.mapByKey();
    const final = MetricTable.cache.get(key);
    if (!final) {
      throw new ErrorDatabase('Could not create metric:' + key);
    }
    return final;
  }
}
