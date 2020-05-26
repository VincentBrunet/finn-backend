import express from 'express';
import cors from 'cors';

import { Route } from './routes/Route';

import { ScreenerTable } from './routes/screener/ScreenerTable';

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
    this.get('/screener/table', ScreenerTable);
    this.get('/ticker/list', TickerList);
    this.get('/ticker/summary/:code', TickerSummary);
    // Crons
    this.run(EodTickers);
    this.run(EodFundamentalsStocks);
  }

  private get(path: string, handler: new () => Route) {
    console.log('route:register', path, handler);
    this.app.get(path, this.make(new handler()));
  }

  private make(route: Route) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const params = {};
        Object.assign(params, req.query);
        Object.assign(params, req.params);
        console.log('route:run', req.route.path, params);
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

  private run(type: new () => Cron) {
    console.log('cron:register', type);
    const cron = new type();
    const runner = async () => {
      console.log('cron:start', cron);
      try {
        await cron.run();
      } catch (e) {
        console.log('cron:error', e);
      }
      console.log('cron:end', cron);
      setTimeout(() => {
        runner();
      }, cron.repeat);
    };
    runner();
  }
}
