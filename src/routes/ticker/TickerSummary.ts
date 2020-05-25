import { Route } from '../Route';

import { Ticker } from '../../services/database/Ticker';
import { Value } from '../../services/database/Value';
import { Metric } from '../../services/database/Metric';

import { NotFoundError } from '../utils/NotFoundError';

export class TickerSummary implements Route {
  async run(param: any) {
    const tickerByCode = await Ticker.mapByCode();
    const ticker = tickerByCode.get(param.code);
    if (!ticker) {
      throw new NotFoundError('Ticker not found: ' + param.code);
    }

    const metrics = await Metric.listForPeriod('Quarterly');
    const values = await Value.mapByStampByMetricIdForTicker(ticker);

    const charts = metrics
      .map((metric: Metric) => {
        return {
          metric: metric,
          values: [...(values.get(metric.id)?.values() ?? [])].map((value) => {
            return { stamp: value.stamp, value: value.value };
          }),
        };
      })
      .filter((chart) => {
        return chart.values.length > 0;
      });

    return {
      ticker: ticker,
      charts: charts,
    };
  }
}
