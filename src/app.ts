import express from 'express';

import { Route } from './routes/Route';
import { Test } from './routes/Test';

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
    this.app.use(express.json());
    this.app.get('/', this.make(new Test()));
  }

  private make(route: Route) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const params = req.query || req.params;
        const json = await route.run(params);
        res.status(200);
        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify(json, undefined, 2));
      } catch (e) {
        res.status(500);
        res.json(e.toString());
        res.end();
      }
    };
  }

  listen(port: number, done: () => void) {
    this.app.listen(port, done);
    this.run(new DownloadTickers());
    this.run(new DownloadIncomeStatements());
    this.run(new DownloadCashflowStatements());
    this.run(new DownloadBalanceSheetStatements());
    this.run(new DownloadFinancialRatios());
    this.run(new DownloadFinancialKeyMetrics());
  }

  private run(cron: Cron) {
    setTimeout(async () => {
      await cron.run();
      setTimeout(() => {
        this.run(cron);
      }, cron.repeat);
    }, cron.delay);
  }
}
