import { Route } from '../Route';

import { Ticker } from '../../services/database/Ticker';
import { Metric } from '../../services/database/Metric';
import { Value } from '../../services/database/Value';
//import { Unit } from '../../services/database/Unit';

import { NotFoundError } from '../utils/NotFoundError';

export class TickerSummary implements Route {
  async run(param: any) {
    const tickerBySymbol = await Ticker.mapBySymbol();
    const tickerByCode = await Ticker.mapByCode();

    let ticker = tickerByCode.get(param.code);
    if (!ticker) {
      ticker = tickerBySymbol.get(param.code);
    }
    if (!ticker) {
      throw new NotFoundError('Ticker not found: ' + param.code);
    }

    const metrics = await Metric.listForPeriod('Yearly');
    const values = await Value.mapByStampByMetricIdForTicker(ticker);

    const charts = metrics
      .map((metric: Metric) => {
        return {
          metric_id: metric.id,
          values: [...(values.get(metric.id)?.values() ?? [])].map((value) => {
            return {
              stamp: value.stamp,
              value: value.value,
              unit_id: value.unit_id,
            };
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
