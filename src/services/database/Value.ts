import moment from 'moment';

import { Connection } from './Connection';

import { Metric } from './Metric';
import { Ticker } from './Ticker';

export interface Value extends ValueShell {
  id: number;
}
export interface ValueShell {
  ticker_id: number;
  metric_id: number;
  stamp: Date;
  value: number;
}

export class Value {
  /**
   * Base
   */
  private static table = 'value';
  static async update(value: Value) {
    await Connection.update<Value>(Value.table, value);
  }
  static async insert(value: ValueShell) {
    await Connection.insert<ValueShell>(Value.table, value);
  }
  static async insertBatch(values: ValueShell[]) {
    await Connection.insertBatch<ValueShell>(Value.table, values);
  }
  static async listByMetricAndStamp(
    metric: Metric,
    stampMin: string | moment.Moment,
    stampMax: string | moment.Moment
  ) {
    const stampMinMoment = moment(stampMin);
    const stampMaxMoment = moment(stampMax);
    const connection = await Connection.connect();
    const query = connection.select('*').from(Value.table);
    return await query
      .select('*')
      .where('metric_id', metric.id)
      .where('stamp', '>', stampMinMoment.toISOString())
      .where('stamp', '<', stampMaxMoment.toISOString());
  }
  static async listByTicker(ticker: Ticker) {
    const connection = await Connection.connect();
    const query = connection.select('*').from(Value.table);
    return await query.where('ticker_id', ticker.id);
  }
}
