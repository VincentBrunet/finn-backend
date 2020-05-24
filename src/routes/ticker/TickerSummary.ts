import { Route } from '../Route';

import { Ticker } from '../../services/database/Ticker';

import { NotFoundError } from '../utils/NotFoundError';
import { Value } from '../../services/database/Value';
import { Metric } from '../../services/database/Metric';

export class TickerSummary implements Route {
  async run(param: any) {
    const tickerBySymbol = await Ticker.bySymbol();
    const ticker = tickerBySymbol.get(param.symbol);
    if (!ticker) {
      throw new NotFoundError('Ticker not found: ' + param.symbol);
    }

    const metrics = await Metric.listByPeriod('Quarter');
    const values = await Value.listByTicker(ticker);

    const valuesByMetricId = new Map<number, { stamp: string; value: number }[]>();
    for (const value of values) {
      const valuesInMetricId = valuesByMetricId.get(value.metric_id) ?? [];
      if (!valuesByMetricId.has(value.metric_id)) {
        valuesByMetricId.set(value.metric_id, valuesInMetricId);
      }
      valuesInMetricId.push({
        stamp: value.stamp,
        value: value.value,
      });
    }

    const charts = metrics.map((metric: Metric) => {
      return {
        metric: metric,
        values: valuesByMetricId.get(metric.id)?.length,
      };
    });

    return {
      ticker: ticker,
      charts: charts,
    };
  }
}
