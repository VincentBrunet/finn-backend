import FuzzySearch from 'fuzzy-search';

import moment from 'moment';

import { Route } from '../Route';

import { Metric } from '../../services/database/Metric';
import { Ticker } from '../../services/database/Ticker';
import { Value } from '../../services/database/Value';

export class ScreenerTable implements Route {
  async run(param: any) {
    const columns = ['MarketCap Key', 'DividendYield Key', 'DividendYield Ratio', 'DividendPayout'];

    const tickers = await Ticker.list();

    const metricsList = await Metric.list();
    const metricsSearcher = new FuzzySearch(metricsList, ['name', 'category', 'identifier'], {
      sort: true,
    });

    const last = moment().subtract(1, 'quarter');
    const min = moment(last).startOf('quarter');
    const max = moment(last).endOf('quarter');

    console.log('last', last);
    console.log('min', min);
    console.log('max', max);

    const metricByColumn = new Map<string, Metric>();
    const valueByTickerIdByColumn = new Map<string, Map<number, Value>>();
    for (const column of columns) {
      const metrics = metricsSearcher.search(column);
      const metric = metrics[0];
      metricByColumn.set(column, metric);
      const values = await Value.listByMetricAndStamp(metric, min, max);
      const valueByTickerId = new Map<number, Value>();
      for (const value of values) {
        valueByTickerId.set(value.ticker_id, value);
      }
      valueByTickerIdByColumn.set(column, valueByTickerId);
    }

    console.log('metricByColumn', metricByColumn);
    /*
    console.log('valueByTickerIdByColumn', valueByTickerIdByColumn);
    */

    const rows = [];
    for (const ticker of tickers) {
      const row = [];
      row.push(ticker);
      let keep = false;
      for (const column of columns) {
        const value = valueByTickerIdByColumn.get(column)?.get(ticker.id)?.value;
        if (value === undefined) {
          row.push(null);
        } else {
          row.push(value);
          keep = true;
        }
      }
      if (keep) {
        rows.push(row);
      }
    }

    const columnsWithMetrics = columns.map((column) => {
      return {
        value: column,
        metric: metricByColumn.get(column),
      };
    });

    return {
      columns: columnsWithMetrics,
      rows: rows,
    };
  }
}
