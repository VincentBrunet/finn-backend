import { Connection } from './Connection';

export interface Metric {
  id?: number;
  name: string;
  category: string;
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
  static async insert(value: Metric) {
    await Connection.insert<Metric>(Metric.table, value);
  }
  static async update(value: Metric) {
    await Connection.update<Metric>(Metric.table, value);
  }
  static async insertIgnoreFailure(value: Metric) {
    await Connection.insertIgnoreFailure<Metric>(Metric.table, value);
  }
  /**
   * Utils
   */
  private static cache: Map<string, Metric>;
  private static cacheKey(name: string, category: string, period: string) {
    const uppercaseName = name.toUpperCase();
    const uppercaseCategory = category.toUpperCase();
    const uppercasePeriod = period.toUpperCase();
    return `${uppercaseName}:${uppercaseCategory}:${uppercasePeriod}`;
  }
  private static async makeCache() {
    Metric.cache = new Map<string, Metric>();
    for (const metric of await Metric.list()) {
      const key = Metric.cacheKey(metric.name, metric.category, metric.period);
      Metric.cache.set(key, metric);
    }
  }
  static async getOrMake(name: string, category: string, period: string) {
    if (!Metric.cache) {
      await Metric.makeCache();
    }
    const key = Metric.cacheKey(name, category, period);
    if (!Metric.cache.has(key)) {
      await Metric.insertIgnoreFailure({
        name: name[0].toUpperCase() + name.slice(1),
        category: category,
        period: period,
      });
      await Metric.makeCache();
    }
    return Metric.cache.get(key);
  }
}
