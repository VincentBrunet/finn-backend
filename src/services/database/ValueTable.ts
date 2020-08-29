import moment from 'moment';

import { Metric, MetricId } from './../../lib/data/Metric';
import { Ticker, TickerId } from './../../lib/data/Ticker';
import { Value, ValueChunkTicker, ValueShell, ValueStamp } from './../../lib/data/Value';
import { MapMapMapArray } from '../../lib/struct/MapMapMapArray';
import { Connection } from './Connection';
import { MetricTable } from './MetricTable';

export class ValueTable {
  /**
   * Base
   */
  private static table = 'value';
  static async update(value: Value) {
    await Connection.update<Value>(ValueTable.table, value);
  }
  static async updateBatch(values: Value[]) {
    await Connection.updateBatch<Value>(ValueTable.table, values);
  }
  static async insert(value: ValueShell) {
    await Connection.insert<ValueShell>(ValueTable.table, value);
  }
  static async insertBatch(values: ValueShell[]) {
    await Connection.insertBatch<ValueShell>(ValueTable.table, values);
  }
  /**
   * Processing
   */
  static async processingCleanup(values: ValueShell[]) {
    const metricsById = await MetricTable.mapById();
    const valuesByTickerByMetricByStamp = new MapMapMapArray<
      TickerId,
      MetricId,
      ValueStamp,
      ValueShell
    >();
    for (const value of values) {
      const metric = metricsById.get(value.metric_id);
      if (!metric) {
        continue;
      }
      const period = metric.period;
      const stamp = moment.utc(value.stamp).endOf(period).valueOf() as ValueStamp;
      valuesByTickerByMetricByStamp.push(value.ticker_id, metric.id, stamp, value);
    }
    const deduped: ValueShell[] = [];
    valuesByTickerByMetricByStamp.forEach((values, _1, _2, stamp) => {
      values.sort((a, b) => {
        return b.stamp - a.stamp;
      });
      const kept = values[0];
      kept.stamp = stamp;
      deduped.push(kept);
    });
    return deduped;
  }
  /**
   * Filtered reading
   */
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
  static async chunkTicker(ticker: Ticker) {
    const values = await ValueTable.listForTicker(ticker);
    const chunkTicker = new ValueChunkTicker();
    for (const value of values) {
      chunkTicker.set(value.metric_id, value.stamp, value);
    }
    return chunkTicker;
  }
}
