import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { DownloadUtils } from './DownloadUtils';

export class DownloadFinancialRatios implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    await DownloadUtils.uploadValuesHistories(
      'FinancialRatio',
      Api.financialRatiosQuarterly,
      Api.financialRatiosYearly
    );
  }
}
