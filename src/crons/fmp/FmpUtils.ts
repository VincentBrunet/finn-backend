import moment from 'moment';

import { Metric } from '../../services/database/Metric';
import { Ticker } from '../../services/database/Ticker';
import { Value } from '../../services/database/Value';

import { Strings } from '../../services/utils/Strings';
import { Unit } from '../../services/database/Unit';

export class FmpUtils {
  static async uploadValuesHistories(
    valuesCategory: string,
    valuesQuarterlyHistoryFetcher: (ticker: string) => Promise<any[]>,
    valuesYearlyHistoryFetcher: (ticker: string) => Promise<any[]>
  ) {
    let tickers = await Ticker.list();
    const count = tickers.length;
    for (let i = 0; i < count; i++) {
      const ticker = tickers[i];
      const valuesByStampByMetricId = await Value.mapByStampByMetricIdForTicker(ticker);
      const valuesQuarterlyHistory = await valuesQuarterlyHistoryFetcher(ticker.code);
      await FmpUtils.uploadValuesHistory(
        valuesQuarterlyHistory,
        ticker,
        valuesCategory,
        'Quarter',
        valuesByStampByMetricId
      );
      const valuesYearlyHistory = await valuesYearlyHistoryFetcher(ticker.code);
      await FmpUtils.uploadValuesHistory(
        valuesYearlyHistory,
        ticker,
        valuesCategory,
        'Year',
        valuesByStampByMetricId
      );
      console.log(
        `[SYNC]`,
        // Ticker def
        Strings.padPostfix(`${ticker.code}`, 7),
        '-',
        Strings.ellipsis(Strings.padPostfix(`${ticker.name}`, 45), 45),
        // Sync status
        Strings.padPrefix(i + 1, 5, '0'),
        '/',
        Strings.padPrefix(count, 4, '0'),
        '-',
        Strings.padPrefix(valuesQuarterlyHistory.length, 3, '0'),
        'x',
        Strings.padPrefix(valuesYearlyHistory.length, 3, '0'),
        // Sync type
        Strings.padPrefix(`<${valuesCategory}>`, 25)
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
        const stamp = moment(object['date']).toDate().getTime();
        if (isNaN(stamp)) {
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
            const unit = await Unit.lookup('N/A');
            if (!unit) {
              continue;
            }
            const existing = existings.get(metric.id)?.get(stamp);
            if (!existing) {
              inserts.push({
                ticker_id: ticker.id,
                metric_id: metric.id,
                unit_id: unit.id,
                stamp: stamp,
                value: value,
              });
            }
            if (existing && existing?.value != value) {
              updates.push({
                id: existing?.id,
                ticker_id: ticker.id,
                metric_id: metric.id,
                unit_id: unit.id,
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
}
