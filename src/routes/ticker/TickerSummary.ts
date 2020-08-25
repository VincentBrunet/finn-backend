import { Metric } from '../../lib/data/Metric';
import { MetricTable } from '../../services/database/MetricTable';
import { TickerTable } from '../../services/database/TickerTable';
import { ValueTable } from '../../services/database/ValueTable';
import { Route } from '../Route';
import { NotFoundError } from '../utils/NotFoundError';

export class TickerSummary implements Route {
  async run(param: any) {
    const tickerBySymbol = await TickerTable.mapBySymbol();
    const tickerByCode = await TickerTable.mapByCode();

    let ticker = tickerByCode.get(param.code);
    if (!ticker) {
      ticker = tickerBySymbol.get(param.code);
    }
    if (!ticker) {
      throw new NotFoundError('Ticker not found: ' + param.code);
    }

    const metrics = await MetricTable.listForPeriod('Yearly');
    const values = await ValueTable.mapByStampByMetricIdForTicker(ticker);

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
