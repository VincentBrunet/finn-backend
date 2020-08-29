import moment from 'moment';

import { Metric, MetricCategory, MetricName, MetricPeriod } from '../../lib/data/Metric';
import { Ticker } from '../../lib/data/Ticker';
import { Value, ValueShell, ValueStamp } from '../../lib/data/Value';
import { Strings } from '../../lib/primitives/Strings';
import { MapArray } from '../../lib/struct/MapArray';
import { MetricTable } from '../../services/database/MetricTable';
import { TickerTable } from '../../services/database/TickerTable';
import { ValueTable } from '../../services/database/ValueTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';
import { EodConstants } from './EodConstants';

export class EodPrices extends Cron {
  async run() {
    // Pricing metrics
    const metricPriceDay = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Daily
    );
    const metricPriceMonth = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Monthly
    );
    const metricPriceQuarter = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Quarterly
    );
    const metricPriceYear = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Yearly
    );

    // Loop over all tickers
    const tickers = await TickerTable.list();
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      // Make sure we only deal with the supported tickers
      if (!EodConstants.tickerTypeWhitelist.has(ticker.type)) {
        continue;
      }

      // Get existing values for ticker
      const chunkTicker = await ValueTable.chunkTicker(ticker);

      // Query pricing API data
      const prices = await EodApi.prices(ticker.code);
      if (!prices) {
        continue;
      }

      // Group all pricing by period
      const dataByDay = new MapArray<ValueStamp, any>();
      const dataByMonth = new MapArray<ValueStamp, any>();
      const dataByQuarter = new MapArray<ValueStamp, any>();
      const dataByYear = new MapArray<ValueStamp, any>();
      for (const price of prices) {
        const date = moment.utc(price.date).valueOf();
        const day = moment(date).endOf('day').valueOf() as ValueStamp;
        const month = moment(date).endOf('month').valueOf() as ValueStamp;
        const quarter = moment(date).endOf('quarter').valueOf() as ValueStamp;
        const year = moment(date).endOf('year').valueOf() as ValueStamp;
        const data = {
          date: date,
          price: price.adjusted_close,
          share: price.close,
          volume: price.volume,
        };
        dataByDay.push(day, data);
        dataByMonth.push(month, data);
        dataByQuarter.push(quarter, data);
        dataByYear.push(year, data);
      }

      // Choose and format a single value for each period
      let values: ValueShell[] = [];
      this.dataToValues(dataByDay, metricPriceDay, ticker, values);
      this.dataToValues(dataByMonth, metricPriceMonth, ticker, values);
      this.dataToValues(dataByQuarter, metricPriceQuarter, ticker, values);
      this.dataToValues(dataByYear, metricPriceYear, ticker, values);

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
      await ValueTable.insertBatch(inserts);
      await ValueTable.updateBatch(updates);

      // Log for progress
      console.log(
        `[SYNC]`,
        // Ticker
        Strings.padPostfix(`${ticker.code}`, 15),
        '-',
        Strings.ellipsis(Strings.padPostfix(`${ticker.name}`, 40), 40),
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

  // Only keep a single value for each data period
  dataToValues(
    dataByPeriod: MapArray<ValueStamp, any>,
    metric: Metric,
    ticker: Ticker,
    values: ValueShell[]
  ) {
    dataByPeriod.forEach((data: any[], stamp: ValueStamp) => {
      data.sort((a, b) => {
        return b.date - a.date;
      });
      values.push({
        ticker_id: ticker.id,
        metric_id: metric.id,
        unit_id: ticker.unit_id,
        stamp: stamp,
        value: data[0].price,
      });
    });
  }
}
