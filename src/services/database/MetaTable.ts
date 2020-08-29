import { Meta, MetaShell } from '../../lib/data/Meta';
import { Ticker } from '../../lib/data/Ticker';
import { Connection } from './Connection';

export class MetaTable {
  /**
   * Base
   */
  private static table = 'meta';
  static async update(meta: Meta) {
    await Connection.update<Meta>(MetaTable.table, meta);
  }
  static async updateBatch(metas: Meta[]) {
    await Connection.updateBatch<Meta>(MetaTable.table, metas);
  }
  static async insert(meta: MetaShell) {
    await Connection.insert<MetaShell>(MetaTable.table, meta);
  }
  static async insertBatch(metas: MetaShell[]) {
    await Connection.insertBatch<MetaShell>(MetaTable.table, metas);
  }
  /**
   * Filtered reading
   */
  static async listForTicker(ticker: Ticker) {
    const connection = await Connection.connect();
    const query = connection.select('*').from(MetaTable.table);
    return await query.where('ticker_id', ticker.id);
  }
  /**
   * Utils
   */
  static key(meta: MetaShell) {
    return `${meta.name}:${meta.param}`;
  }
  static async mapByKeyForTicker(ticker: Ticker) {
    const list = await MetaTable.listForTicker(ticker);
    const mapping = new Map<string, Meta>();
    for (const item of list) {
      mapping.set(MetaTable.key(item), item);
    }
    return mapping;
  }
  static async map() {}
}
