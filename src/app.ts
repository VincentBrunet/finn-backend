import express from 'express';
import cors from 'cors';

import { Route } from './routes/Route';

import { ScreenerTable } from './routes/screener/ScreenerTable';

import { TickerList } from './routes/ticker/TickerList';
import { TickerSummary } from './routes/ticker/TickerSummary';

import { Cron } from './crons/Cron';

import { DownloadTickers } from './crons/DownloadTickers';
import { DownloadIncomeStatements } from './crons/DownloadIncomeStatements';
import { DownloadCashflowStatements } from './crons/DownloadCashflowStatements';
import { DownloadBalanceSheetStatements } from './crons/DownloadBalanceSheetStatements';
import { DownloadFinancialRatios } from './crons/DownloadFinancialRatios';
import { DownloadFinancialKeyMetrics } from './crons/DownloadFinancialKeyMetrics';

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.get('/screener/table', ScreenerTable);
    this.get('/ticker/list', TickerList);
    this.get('/ticker/summary/:symbol', TickerSummary);
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
    this.run(DownloadTickers);
    this.run(DownloadIncomeStatements);
    this.run(DownloadCashflowStatements);
    this.run(DownloadBalanceSheetStatements);
    this.run(DownloadFinancialRatios);
    this.run(DownloadFinancialKeyMetrics);
  }

  private run(type: new () => Cron) {
    console.log('cron:register', type);
    const cron = new type();
    const runner = async () => {
      console.log('cron:run', cron);
      try {
        await cron.run();
      } catch (e) {
        console.log('cron:error', e);
      }
      setTimeout(() => {
        runner();
      }, cron.repeat);
    };
    runner();
  }
}
