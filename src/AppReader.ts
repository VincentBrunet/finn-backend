import { App } from './App';
import { MetricList } from './routes/indices/MetricList';
import { TickerList } from './routes/indices/TickerList';
import { UnitList } from './routes/indices/UnitList';
import { ScreenerTable } from './routes/pages/ScreenerTable';
import { TickerSummary } from './routes/pages/TickerSummary';

export class AppReader extends App {
  protected setup() {
    this.get('/indices/metric-list', MetricList);
    this.get('/indices/ticker-list', TickerList);
    this.get('/indices/unit-list', UnitList);
    this.get('/pages/ticker-summary/:code', TickerSummary);
    this.get('/pages/screener-table', ScreenerTable);
  }
}
