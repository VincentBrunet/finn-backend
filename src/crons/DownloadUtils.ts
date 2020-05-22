import moment from 'moment';

import { Metric } from '../services/database/Metric';
import { Ticker } from '../services/database/Ticker';
import { Value } from '../services/database/Value';

export class DownloadUtils {
  static async uploadValuesHistories(
    valuesCategory: string,
    valuesQuarterlyHistoryFetcher: (ticker: string) => Promise<any[]>,
    valuesYearlyHistoryFetcher: (ticker: string) => Promise<any[]>
  ) {
    let tickers = await Ticker.list();
    const count = tickers.length;
    for (let i = 0; i < count; i++) {
      const ticker = tickers[i];
      const values = await Value.listByTicker(ticker);
      const valuesByStampByMetricId = new Map<number, Map<number, Value>>();
      for (const value of values) {
        let valuesByStamp = valuesByStampByMetricId.get(value.metric_id);
        if (!valuesByStamp) {
          valuesByStamp = new Map<number, Value>();
          valuesByStampByMetricId.set(value.metric_id, valuesByStamp);
        }
        valuesByStamp.set(value.stamp.getTime(), value);
      }
      const valuesQuarterlyHistory = await valuesQuarterlyHistoryFetcher(ticker.symbol);
      await DownloadUtils.uploadValuesHistory(
        valuesQuarterlyHistory,
        ticker,
        valuesCategory,
        'Quarter',
        valuesByStampByMetricId
      );
      const valuesYearlyHistory = await valuesYearlyHistoryFetcher(ticker.symbol);
      await DownloadUtils.uploadValuesHistory(
        valuesYearlyHistory,
        ticker,
        valuesCategory,
        'Year',
        valuesByStampByMetricId
      );
      console.log(
        `[SYNC]`,
        // Ticker def
        DownloadUtils.padPostfix(`${ticker.symbol}`, 7),
        '-',
        DownloadUtils.ellipsis(DownloadUtils.padPostfix(`${ticker.name}`, 45), 45),
        // Sync status
        DownloadUtils.padPrefix(i + 1, 5, '0'),
        '/',
        DownloadUtils.padPrefix(count, 4, '0'),
        '-',
        DownloadUtils.padPrefix(valuesQuarterlyHistory.length, 3, '0'),
        'x',
        DownloadUtils.padPrefix(valuesYearlyHistory.length, 3, '0'),
        // Sync type
        DownloadUtils.padPrefix(`<${valuesCategory}>`, 25)
      );
    }
  }

  static async uploadValuesHistory(
    objects: any[],
    ticker: Ticker,
    category: string,
    period: string,
    existings: Map<number, Map<number, Value>>
  ) {
    try {
      const inserts = [];
      const updates = [];
      for (const object of objects) {
        const stamp = moment(object['date']).toDate();
        const time = stamp.getTime();
        if (isNaN(time)) {
          continue;
        }
        for (const row in object) {
          const item = object[row];
          if (typeof item === 'number') {
            const value = parseFloat(item.toPrecision(15));
            const name = row[0].toUpperCase() + row.slice(1);
            const metric = await Metric.lookup(name, category, period);
            if (!metric) {
              continue;
            }
            const existing = existings.get(metric.id)?.get(time);
            if (!existing) {
              inserts.push({
                ticker_id: ticker.id,
                metric_id: metric.id,
                stamp: stamp,
                value: value,
              });
            }
            if (existing && existing?.value != value) {
              updates.push({
                id: existing?.id,
                ticker_id: ticker.id,
                metric_id: metric.id,
                stamp: stamp,
                value: value,
              });
            }
          }
        }
      }
      if (inserts.length > 0) {
        console.log('INSERTING', inserts.length);
        await Value.insertBatch(inserts);
      }
      if (updates.length > 0) {
        console.log('UPDATING', updates.length);
        for (const update of updates) {
          await Value.update(update);
        }
      }
    } catch (e) {
      console.log('Could not upload', e);
    }
  }

  private static padPostfix(value: string | number, size: number, postfix?: string) {
    let s = value + '';
    while (s.length < size) {
      s = s + (postfix ?? ' ');
    }
    return s;
  }

  private static padPrefix(value: string | number, size: number, prefix?: string) {
    let s = value + '';
    while (s.length < size) {
      s = (prefix ?? ' ') + s;
    }
    return s;
  }

  private static ellipsis(value: string | number, size: number) {
    let s = value + '';
    if (s.length > size) {
      s = s.slice(0, size - 3) + '...';
    }
    return s;
  }
}
