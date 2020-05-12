import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { DownloadUtils } from './DownloadUtils';

export class DownloadIncomeStatements implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    await DownloadUtils.uploadValuesHistories(
      'IncomeStatement',
      Api.incomeStatementsQuarterly,
      Api.incomeStatementsYearly
    );
  }
}
