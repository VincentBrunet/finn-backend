import FuzzySearch from 'fuzzy-search';

import moment from 'moment';

import { Route } from '../Route';

import { Metric } from '../../services/database/Metric';
import { Ticker } from '../../services/database/Ticker';
import { Value } from '../../services/database/Value';
import { Unit } from '../../services/database/Unit';

export class ScreenerTable implements Route {
  async run(param: any) {
    const columns = ['Dividend', 'TotalRevenue', 'Profit'];

    const tickers = await Ticker.list();

    const unitsById = await Unit.mapById();

    const metrics = await Metric.list();
    const metricsSearcher = new FuzzySearch(metrics, ['name', 'category'], {
      sort: true,
    });

    const last = moment().subtract(1, 'year');
    const min = moment(last).startOf('year');
    const max = moment(last).endOf('year');

    const metricByColumn = new Map<string, Metric>();
    const valueByTickerIdByColumn = new Map<string, Map<number, Value>>();
    for (const column of columns) {
      const metrics = metricsSearcher.search(column);
      if (metrics.length <= 1) {
        continue;
      }
      const metric = metrics[1];
      metricByColumn.set(column, metric);
      const values = await Value.listForMetricAndStamp(metric, min, max);
      const valueByTickerId = new Map<number, Value>();
      for (const value of values) {
        valueByTickerId.set(value.ticker_id, value);
      }
      valueByTickerIdByColumn.set(column, valueByTickerId);
    }

    const rows = [];
    for (const ticker of tickers) {
      const row = [];
      row.push(ticker);
      let keep = false;
      for (const column of columns) {
        const value = valueByTickerIdByColumn.get(column)?.get(ticker.id);
        if (value === undefined) {
          row.push(null);
        } else {
          row.push({
            value: value.value,
            unit: unitsById.get(value.unit_id),
          });
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