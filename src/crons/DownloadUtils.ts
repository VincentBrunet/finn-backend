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
      for (const values of valuesQuarterlyHistory) {
        await DownloadUtils.uploadValues(
          values,
          ticker,
          valuesCategory,
          'Quarter',
          valuesByStampByMetricId
        );
      }
      const valuesYearlyHistory = await valuesYearlyHistoryFetcher(ticker.symbol);
      for (const values of valuesYearlyHistory) {
        await DownloadUtils.uploadValues(
          values,
          ticker,
          valuesCategory,
          'Year',
          valuesByStampByMetricId
        );
      }
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

  /*
  2019-09-29T22:00:00.000Z
  2019-09-29T22:00:00.000Z
  */

  static async uploadValues(
    object: any,
    ticker: Ticker,
    category: string,
    period: string,
    existings: Map<number, Map<number, Value>>
  ) {
    try {
      const stamp = moment(object['date']).toDate();
      for (const row in object) {
        const value = object[row];
        if (typeof value === 'number') {
          const name = row[0].toUpperCase() + row.slice(1);
          const key = `${name.toUpperCase()}:${category.toUpperCase()}:${period.toUpperCase()}`;
          const identifier = `${name} (${category})`;
          const metric = await Metric.cached(key, name, category, identifier, period);
          if (!metric) {
            continue;
          }
          const existing = existings.get(metric.id)?.get(stamp.getTime());
          if (!existing || existing.value !== value) {
            await Value.insertIgnoreFailure({
              ticker_id: ticker.id,
              metric_id: metric.id,
              stamp: stamp,
              value: value,
            });
          }
        }
      }
    } catch (e) {
      console.log('Could not upload', e, object);
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
