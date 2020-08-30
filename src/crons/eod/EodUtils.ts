import moment from 'moment';

import { MetricCategory, MetricPeriod } from './../../lib/data/Metric';
import { Ticker } from './../../lib/data/Ticker';
import { Unit } from './../../lib/data/Unit';
import {
  Value,
  ValueChunkTicker,
  ValueShell,
  ValueStamp,
  ValueValue,
} from './../../lib/data/Value';
import { MetricTable } from './../../services/database/MetricTable';
import { UnitTable } from './../../services/database/UnitTable';
import { ValueTable } from './../../services/database/ValueTable';
import { EodConstants } from './EodConstants';

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
    category: MetricCategory,
    chunkTicker: ValueChunkTicker
  ) {
    const unit = await UnitTable.lookupByCode(data['currency_symbol']);
    await EodUtils.uploadValuesHistory(
      ticker,
      data['quarterly'],
      category,
      MetricPeriod.Quarterly,
      unit,
      chunkTicker
    );
    await EodUtils.uploadValuesHistory(
      ticker,
      data['yearly'],
      category,
      MetricPeriod.Yearly,
      unit,
      chunkTicker
    );
  }

  static async uploadValuesHistory(
    ticker: Ticker,
    data: any,
    category: MetricCategory,
    period: MetricPeriod,
    unit: Unit,
    chunkTicker: ValueChunkTicker
  ) {
    const values: ValueShell[] = [];
    for (const key in data) {
      const object = data[key];

      let date = object['date'];
      date = date.replace('Q1', '01-01');
      date = date.replace('Q2', '04-01');
      date = date.replace('Q3', '07-01');
      date = date.replace('Q4', '10-01');
      const stamp = moment.utc(date).valueOf() as ValueStamp;
      if (isNaN(stamp)) {
        continue;
      }

      const innerUnit = await UnitTable.lookupByCode(object['currency_symbol']);
      if (innerUnit.code) {
        unit = innerUnit;
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

        const name = key[0].toUpperCase() + key.slice(1);
        const metricName = EodConstants.objectKeyToMetricName.get(name);
        if (metricName === undefined) {
          console.log('Could not resolve metric name', name, metricName);
          continue;
        }

        const metric = await MetricTable.lookup(metricName, category, period);

        const value: ValueShell = {
          ticker_id: ticker.id,
          metric_id: metric.id,
          unit_id: unit.id,
          stamp: stamp,
          value: parseFloat(numberized.toPrecision(15)) as ValueValue,
        };

        values.push(value);
      }
    }

    // Decide mutations on DB
    const processed = await ValueTable.processingCleanup(values);
    const inserts: ValueShell[] = [];
    const updates: Value[] = [];
    for (const value of processed) {
      const existing = chunkTicker.get(value.metric_id, value.stamp);
      if (existing) {
        if (existing.value !== value.value || existing.unit_id !== value.unit_id) {
          updates.push({ id: existing.id, ...value });
        }
      } else {
        inserts.push(value);
      }
    }

    // Database mutations
    await ValueTable.insertBatch(inserts);
    await ValueTable.updateBatch(updates);
  }
}
