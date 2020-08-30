import FuzzySearch from 'fuzzy-search';
import moment from 'moment';

import { Metric, MetricPeriod } from './../../lib/data/Metric';
import { Value } from './../../lib/data/Value';
import { MetricTable } from './../../services/database/MetricTable';
import { TickerTable } from './../../services/database/TickerTable';
import { ValueTable } from './../../services/database/ValueTable';
import { Route } from './../Route';

export class ScreenerTable implements Route {
  async run(param: any) {
    const columns = ['net-income', 'ebit', 'price'];

    const tickers = await TickerTable.listCommonStocks();

    const metricList = await MetricTable.listForPeriod(MetricPeriod.Quarterly);
    const metricsSearcher = new FuzzySearch(metricList, ['name'], {
      sort: true,
    });

    const last = moment.utc().subtract(1, 'quarter');
    const min = moment(last).endOf('quarter');
    const max = moment(last).endOf('quarter');

    const metricByColumn = new Map<string, Metric>();
    const valueByTickerIdByColumn = new Map<string, Map<number, Value>>();
    for (const column of columns) {
      const metrics = metricsSearcher.search(column);
      if (metrics.length <= 0) {
        continue;
      }
      const metric = metrics[0];
      metricByColumn.set(column, metric);
      const values = await ValueTable.listForMetricAndStamp(metric, min, max);
      const valueByTickerId = new Map<number, Value>();
      for (const value of values) {
        valueByTickerId.set(value.ticker_id, value);
      }
      valueByTickerIdByColumn.set(column, valueByTickerId);
    }

    const rows = [];
    for (const ticker of tickers) {
      const row = [];
      row.push(ticker.id);
      let keep = false;
      for (const column of columns) {
        const value = valueByTickerIdByColumn.get(column)?.get(ticker.id);
        if (value === undefined) {
          row.push(null);
        } else {
          row.push([value.value, value.unit_id]);
          keep = true;
        }
      }
      if (keep) {
        rows.push(row);
      }
    }

    const metrics = [];
    for (const column of columns) {
      metrics.push(metricByColumn.get(column)?.id);
    }

    return {
      metrics: metrics,
      rows: rows,
    };
  }
}
