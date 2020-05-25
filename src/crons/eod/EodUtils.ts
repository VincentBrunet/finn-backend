import moment from 'moment';

import { Metric } from '../../services/database/Metric';
import { Ticker } from '../../services/database/Ticker';
import { Value } from '../../services/database/Value';
import { Unit } from '../../services/database/Unit';

export class EodUtils {
  static async uploadValuesHistories(
    ticker: Ticker,
    data: any,
    category: string,
    valuesByStampByMetricId: Map<number, Map<number, Value>>
  ) {
    await EodUtils.uploadValuesHistory(
      ticker,
      data['quarterly'],
      category,
      'Quarterly',
      data['currency_symbol'],
      valuesByStampByMetricId
    );
    await EodUtils.uploadValuesHistory(
      ticker,
      data['yearly'],
      category,
      'Yearly',
      data['currency_symbol'],
      valuesByStampByMetricId
    );
  }

  static async uploadValuesHistory(
    ticker: Ticker,
    data: any,
    category: string,
    period: string,
    unitName: string,
    existings: Map<number, Map<number, Value>>
  ) {
    try {
      const inserts = [];
      const updates = [];
      for (const key in data) {
        const object = data[key];
        let date = object['date'];
        date = date.replace('Q1', '01-01');
        date = date.replace('Q2', '04-01');
        date = date.replace('Q3', '07-01');
        date = date.replace('Q4', '10-01');
        const stamp = moment.utc(date).valueOf();
        if (isNaN(stamp)) {
          continue;
        }
        for (const key in object) {
          if (key === 'date') {
            continue;
          }
          if (key === 'reportDate') {
            continue;
          }
          if (key === 'filing_date') {
            continue;
          }
          if (key === 'currency_symbol') {
            continue;
          }
          const item = object[key];
          if (item === null) {
            continue;
          }
          const numberized = parseFloat(item);
          if (isNaN(numberized)) {
            continue;
          }
          const value = parseFloat(numberized.toPrecision(15));
          const name = key[0].toUpperCase() + key.slice(1);
          const metric = await Metric.lookup(name, category, period);
          if (!metric) {
            continue;
          }
          const unit = await Unit.lookup(unitName);
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
          if (existing) {
            if (existing?.value !== value || existing.unit_id !== unit.id) {
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
