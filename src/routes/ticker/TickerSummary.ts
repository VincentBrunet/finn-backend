import { Route } from '../Route';

import { Ticker } from '../../services/database/Ticker';
import { Metric } from '../../services/database/Metric';
import { Value } from '../../services/database/Value';
import { Unit } from '../../services/database/Unit';

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

    const unitsById = await Unit.mapById();

    const metrics = await Metric.listForPeriod('Yearly');
    const values = await Value.mapByStampByMetricIdForTicker(ticker);

    const charts = metrics
      .map((metric: Metric) => {
        return {
          metric: metric,
          values: [...(values.get(metric.id)?.values() ?? [])].map((value) => {
            return {
              stamp: value.stamp,
              value: value.value,
              unit: unitsById.get(value.unit_id)?.code,
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
