import { MetricTable } from '../../services/database/MetricTable';
import { Ticker } from '../../lib/data/Ticker';
import { UnitTable } from '../../services/database/UnitTable';
import { Value } from '../../lib/data/Value';
import { ValueTable } from '../../services/database/ValueTable';
import moment from 'moment';

const blackListKeys = new Set<string>();
blackListKeys.add('date');
blackListKeys.add('reportDate');
blackListKeys.add('filing_date');
blackListKeys.add('dateFormatted');
blackListKeys.add('currency_symbol');

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
        const currency = object['currency_symbol'];
        if (currency) {
          unitName = currency;
        }
        for (const key in object) {
          if (blackListKeys.has(key)) {
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
          const metric = await MetricTable.lookup(name, category, period);
          if (!metric) {
            continue;
          }
          const unit = await UnitTable.lookupByCode(unitName);
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
              if (
                ticker.id == existing.ticker_id &&
                metric.id == existing.metric_id &&
                stamp == existing.stamp
              ) {
                console.log(
                  'Update',
                  ticker.code,
                  new Date(stamp).toDateString(),
                  metric.name,
                  ':',
                  existing.value,
                  (await UnitTable.lookupById(existing.unit_id))?.code,
                  '->',
                  value,
                  unit.code
                );
              } else {
                console.log('WARNING VALUE CONFLICT', existing, updates[updates.length - 1]);
              }
            }
          }
        }
      }
      if (inserts.length > 0) {
        console.log('[SYNC] DB ++ INSERTING', inserts.length);
        try {
          await ValueTable.insertBatch(inserts);
        } catch (e) {
          console.log('Error', e, inserts);
        }
      }
      if (updates.length > 0) {
        console.log('[SYNC] DB == UPDATING', updates.length);
        for (const update of updates) {
          await ValueTable.update(update);
        }
      }
    } catch (e) {
      console.log('Could not upload', e);
    }
  }
}
