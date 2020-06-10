import express from 'express';
import cors from 'cors';

import { Route } from './routes/Route';

import { ScreenerTable } from './routes/screener/ScreenerTable';
import { MetricList } from './routes/metric/MetricList';
import { UnitList } from './routes/unit/UnitList';
import { TickerList } from './routes/ticker/TickerList';
import { TickerSummary } from './routes/ticker/TickerSummary';

import { Cron } from './crons/Cron';

import { EodTickers } from './crons/eod/EodTickers';
import { EodFundamentalsStocks } from './crons/eod/EodFundamentalsStocks';

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.setup();
  }

  private setup() {
    // Routes
    this.get('/metric/list', MetricList);
    this.get('/unit/list', UnitList);
    this.get('/ticker/list', TickerList);
    this.get('/ticker/summary/:code', TickerSummary);
    this.get('/screener/table', ScreenerTable);
    // Crons
    this.run('/eod/tickers', EodTickers);
    this.run('/eod/fundamentals-stocks', EodFundamentalsStocks);
  }

  private get(path: string, handler: new () => Route) {
    console.log('route:register', 'GET', path);
    this.app.get(path, this.make(new handler()));
  }

  private make(route: Route) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const params = {};
        Object.assign(params, req.query);
        Object.assign(params, req.params);
        console.log('route:run', req.method, req.route.path, params);
        const json = await route.run(params);
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.send({
          success: true,
          error: null,
          data: json,
        });
      } catch (e) {
        res.status(500);
        res.json({
          success: false,
          error: {
            code: e.code,
            message: e.message,
            stack: e.stack.split('\n'),
          },
          data: null,
        });
        res.end();
      }
    };
  }

  listen(port: number, done: () => void) {
    console.log('app:listen', port);
    this.app.listen(port, done);
  }

  private run(name: string, type: new () => Cron) {
    console.log('cron:register', name);
    const cron = new type();
    const runner = async () => {
      console.log('cron:start', name);
      try {
        await cron.run();
      } catch (e) {
        console.log('cron:error', e);
      }
      console.log('cron:end', name);
      setTimeout(() => {
        runner();
      }, cron.repeat);
    };
    runner();
  }
}
