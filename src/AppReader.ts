import { ScreenerTable } from './routes/screener/ScreenerTable';
import { MetricList } from './routes/metric/MetricList';
import { UnitList } from './routes/unit/UnitList';
import { TickerList } from './routes/ticker/TickerList';
import { TickerSummary } from './routes/ticker/TickerSummary';

import { App } from './App';

export class AppReader extends App {
  protected setup() {
    this.get('/metric/list', MetricList);
    this.get('/unit/list', UnitList);
    this.get('/ticker/list', TickerList);
    this.get('/ticker/summary/:code', TickerSummary);
    this.get('/screener/table', ScreenerTable);
  }
}
