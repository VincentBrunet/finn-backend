import moment from 'moment';

import { Value, ValueShell, ValueStamp } from './../../lib/data/Value';
import { MetricCategory, MetricPeriod } from '../../lib/data/Metric';
import { TickerType } from '../../lib/data/Ticker';
import { Strings } from '../../lib/primitives/Strings';
import { MapArray } from '../../lib/struct/MapArray';
import { MetricTable } from '../../services/database/MetricTable';
import { TickerTable } from '../../services/database/TickerTable';
import { ValueTable } from '../../services/database/ValueTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';

export class EodStocksPrices extends Cron {
  async run() {
    const tickers = await TickerTable.list();

    const metricPriceDay = await MetricTable.lookup(
      'Price',
      MetricCategory.Trading,
      MetricPeriod.Daily
    );
    const metricPriceQuarter = await MetricTable.lookup(
      'Price',
      MetricCategory.Trading,
      MetricPeriod.Quarterly
    );
    const metricPriceYear = await MetricTable.lookup(
      'Price',
      MetricCategory.Trading,
      MetricPeriod.Yearly
    );

    // Loop over all tickers
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      // Make sure we only deal with common stocks
      if (ticker.type !== TickerType.CommonStock) {
        continue;
      }

      // Get existing values for ticker
      const chunkTicker = await ValueTable.chunkTicker(ticker);

      // Query pricing API data
      const prices = await EodApi.prices(ticker.code);

      // Group all pricing by period
      const dataByDay = new MapArray<ValueStamp, any>();
      const dataByQuarter = new MapArray<ValueStamp, any>();
      const dataByYear = new MapArray<ValueStamp, any>();
      for (const price of prices) {
        if (!price) {
          continue;
        }
        const date = moment.utc(price.date).valueOf();
        const day = moment(date).endOf('day').valueOf() as ValueStamp;
        const quarter = moment(date).endOf('quarter').valueOf() as ValueStamp;
        const year = moment(date).endOf('year').valueOf() as ValueStamp;
        const data = {
          date: date,
          price: price.adjusted_close,
          share: price.close,
          volume: price.volume,
        };
        dataByDay.push(day, data);
        dataByQuarter.push(quarter, data);
        dataByYear.push(year, data);
      }

      // Choose and format a single value for each period
      let values: ValueShell[] = [];
      dataByDay.forEach((data: any[], stamp: ValueStamp) => {
        data.sort((a, b) => {
          return b.date - a.date;
        });
        values.push({
          ticker_id: ticker.id,
          metric_id: metricPriceDay.id,
          unit_id: ticker.unit_id,
          stamp: stamp,
          value: data[0].price,
        });
      });
      dataByQuarter.forEach((data: any[], stamp: ValueStamp) => {
        data.sort((a, b) => {
          return b.date - a.date;
        });
        values.push({
          ticker_id: ticker.id,
          metric_id: metricPriceQuarter.id,
          unit_id: ticker.unit_id,
          stamp: stamp,
          value: data[0].price,
        });
      });
      dataByYear.forEach((data: any[], stamp: ValueStamp) => {
        data.sort((a, b) => {
          return b.date - a.date;
        });
        values.push({
          ticker_id: ticker.id,
          metric_id: metricPriceYear.id,
          unit_id: ticker.unit_id,
          stamp: stamp,
          value: data[0].price,
        });
      });

      // Decide mutations on DB
      let inserts: ValueShell[] = [];
      let updates: Value[] = [];
      for (const value of values) {
        const existing = chunkTicker.get(value.metric_id, value.stamp);
        if (existing) {
          if (value.value != existing.value || value.unit_id != existing.unit_id) {
            updates.push({ id: existing.id, ...value });
          }
        } else {
          inserts.push(value);
        }
      }

      // Database mutations
      if (inserts.length > 0) {
        console.log('[SYNC] DB ++ INSERTING', inserts.length);
        await ValueTable.insertBatch(inserts);
      }
      if (updates.length > 0) {
        console.log('[SYNC] DB == UPDATING', updates.length);
        await ValueTable.updateBatch(updates);
      }

      // Log for progress
      console.log(
        `[SYNC]`,
        // Ticker
        Strings.padPostfix(`${ticker.code}`, 10),
        '-',
        Strings.ellipsis(Strings.padPostfix(`${ticker.name}`, 45), 45),
        // Sync status
        Strings.padPrefix(i + 1, 5, '0'),
        '/',
        Strings.padPrefix(tickers.length, 5, '0'),
        // Notes
        '-',
        Strings.padPostfix(`{${ticker.type}}`, 10),
        '-',
        Strings.padPostfix(`<Prices>`, 0)
      );
    }
  }
}
