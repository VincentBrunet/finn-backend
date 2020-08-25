import moment from 'moment';

import { Metric } from '../../lib/data/Metric';
import { Ticker } from '../../lib/data/Ticker';
import { Value, ValueShell } from '../../lib/data/Value';
import { Connection } from './Connection';

export class ValueTable {
  /**
   * Base
   */
  private static table = 'value';
  static async update(value: Value) {
    await Connection.update<Value>(ValueTable.table, value);
  }
  static async insert(value: ValueShell) {
    await Connection.insert<ValueShell>(ValueTable.table, value);
  }
  static async insertBatch(values: ValueShell[]) {
    await Connection.insertBatch<ValueShell>(ValueTable.table, values);
  }
  static async listForMetricAndStamp(
    metric: Metric,
    stampMin: string | moment.Moment,
    stampMax: string | moment.Moment
  ): Promise<Value[]> {
    const stampMinMoment = moment(stampMin);
    const stampMaxMoment = moment(stampMax);
    const connection = await Connection.connect();
    const query = connection.select('*').from(ValueTable.table);
    return await query
      .select('*')
      .where('metric_id', metric.id)
      .where('stamp', '>', stampMinMoment.valueOf())
      .where('stamp', '<', stampMaxMoment.valueOf());
  }
  static async listForTicker(ticker: Ticker): Promise<Value[]> {
    const connection = await Connection.connect();
    const query = connection.select('*').from(ValueTable.table);
    return await query.where('ticker_id', ticker.id);
  }
  /**
   * Utils
   */
  static async mapByStampByMetricIdForTicker(ticker: Ticker) {
    const values = await ValueTable.listForTicker(ticker);
    const valuesByStampByMetricId = new Map<number, Map<number, Value>>();
    for (const value of values) {
      let valuesByStamp = valuesByStampByMetricId.get(value.metric_id);
      if (!valuesByStamp) {
        valuesByStamp = new Map<number, Value>();
        valuesByStampByMetricId.set(value.metric_id, valuesByStamp);
      }
      valuesByStamp.set(value.stamp, value);
    }
    return valuesByStampByMetricId;
  }
}
