import moment from 'moment';

import { MetricCategory, MetricName, MetricPeriod } from './../../lib/data/Metric';
import { Value, ValueShell, ValueStamp } from './../../lib/data/Value';
import { Strings } from './../../lib/primitives/Strings';
import { MetricTable } from './../../services/database/MetricTable';
import { TickerTable } from './../../services/database/TickerTable';
import { ValueTable } from './../../services/database/ValueTable';
import { EodApi } from './../../services/financials/EodApi';
import { Cron } from './../Cron';
import { EodConstants } from './EodConstants';

export class EodPrices extends Cron {
  async run() {
    // Pricing metrics
    const metricDay = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Daily
    );
    const metricMonth = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Monthly
    );
    const metricQuarter = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Quarterly
    );
    const metricYear = await MetricTable.lookup(
      MetricName.Price,
      MetricCategory.Trading,
      MetricPeriod.Yearly
    );

    const metrics = [metricDay, metricMonth, metricQuarter, metricYear];

    // Loop over all tickers
    const tickers = await TickerTable.list();
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      // Make sure we only deal with the supported tickers
      if (!EodConstants.tickerTypeWhitelist.has(ticker.type)) {
        continue;
      }

      // Query pricing API data
      const prices = await EodApi.prices(ticker.code);
      if (!prices) {
        continue;
      }

      // Get existing values for ticker
      const chunkTicker = await ValueTable.chunkTicker(ticker);

      // Group all pricing by period
      const values: ValueShell[] = [];
      for (const price of prices) {
        const stamp = moment.utc(price.date).valueOf() as ValueStamp;
        for (const metric of metrics) {
          values.push({
            metric_id: metric.id,
            ticker_id: ticker.id,
            unit_id: ticker.unit_id,
            stamp: stamp,
            value: price.adjusted_close,
          });
        }
      }

      // Decide mutations on DB
      const processed = await ValueTable.processingCleanup(values);
      const inserts: ValueShell[] = [];
      const updates: Value[] = [];
      for (const value of processed) {
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
}
