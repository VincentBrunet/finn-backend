import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { DownloadUtils } from './DownloadUtils';

export class DownloadCashflowStatements implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    await DownloadUtils.uploadValuesHistories(
      'CashflowStatement',
      Api.cashflowStatementsQuarterly,
      Api.cashflowStatementsYearly
    );
  }
}
