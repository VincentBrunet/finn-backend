import moment from 'moment';

import { Metric } from '../services/database/Metric';
import { Ticker } from '../services/database/Ticker';
import { Value } from '../services/database/Value';

export class DownloadUtils {
  static async uploadValues(object: any, ticker: Ticker, category: string, period: string) {
    if (!ticker.id) {
      return;
    }
    const stamp = moment(object['date']).format();
    for (const key in object) {
      const value = object[key];
      if (typeof value === 'number') {
        const metric = await Metric.getOrMake(key, category, period);
        if (!metric || !metric.id) {
          continue;
        }
        await Value.insertIgnoreFailure({
          ticker_id: ticker.id,
          metric_id: metric.id,
          stamp: stamp,
          value: value,
        });
      }
    }
  }
}
