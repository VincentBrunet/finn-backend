import moment from 'moment';

import { ValueShell } from '../../lib/data/Value';
import { MetricTable } from '../../services/database/MetricTable';
import { TickerTable } from '../../services/database/TickerTable';
import { ValueTable } from '../../services/database/ValueTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';

export class EodStocksPrices extends Cron {
  async run() {
    const tickers = await TickerTable.list();

    const metricPriceQuarterly = await MetricTable.lookup('Price', 'Trading', 'Quarterly');
    if (!metricPriceQuarterly) {
      return;
    }

    const metricPriceYearly = await MetricTable.lookup('Price', 'Trading', 'Yearly');
    if (!metricPriceYearly) {
      return;
    }

    console.log(' Up price');

    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      if (ticker.type !== 'Common Stock') {
        continue;
      }

      const valuesByStampByMetricId = await ValueTable.mapByStampByMetricIdForTicker(ticker);

      const prices = await EodApi.prices(ticker.code);

      const valuesByQuarterlyTimestamp = new Map<number, any[]>();
      const valuesByYearlyTimestamp = new Map<number, any[]>();

      for (const price of prices) {
        const date = moment.utc(price.date);
        const quarter = moment(date).startOf('quarter').valueOf();
        const year = moment(date).startOf('year').valueOf();
        const value = {
          date: date,
          price: price.adjusted_close,
          share: price.close,
          volume: price.volume,
        };
        const valuesQuarterly = valuesByQuarterlyTimestamp.get(quarter) ?? [];
        valuesQuarterly.push(value);
        valuesByQuarterlyTimestamp.set(quarter, valuesQuarterly);
        const valuesYearly = valuesByYearlyTimestamp.get(year) ?? [];
        valuesYearly.push(value);
        valuesByYearlyTimestamp.set(year, valuesYearly);
      }

      let toInsert: ValueShell[] = [];

      valuesByQuarterlyTimestamp.forEach((values: any[], key: number) => {
        values.sort((a, b) => {
          return a.date - b.date;
        });
        toInsert.push({
          ticker_id: ticker.id,
          metric_id: metricPriceQuarterly.id,
          unit_id: ticker.unit_id,
          stamp: values[0].date.valueOf(),
          value: values[0].price,
        });
      });

      valuesByYearlyTimestamp.forEach((values: any[], key: number) => {
        values.sort((a, b) => {
          return a.date - b.date;
        });
        toInsert.push({
          ticker_id: ticker.id,
          metric_id: metricPriceYearly.id,
          unit_id: ticker.unit_id,
          stamp: values[0].date.valueOf(),
          value: values[0].price,
        });
      });

      const up = new Map<string, ValueShell>();
      toInsert.forEach((value: ValueShell) => {
        const key = value.metric_id + '_' + value.stamp;
        if (up.has(key)) {
          console.log('WHUT', up.get(key), value);
        }
        up.set(key, value);
      });
      console.log('what');

      toInsert = toInsert.filter((value: ValueShell) => {
        return !valuesByStampByMetricId.get(value.metric_id)?.get(value.stamp);
      });

      console.log(' End');
      try {
        await ValueTable.insertBatch(toInsert);
      } catch (e) {
        console.log('up', e, toInsert);
      }

      console.log(' done');
    }
  }
}
