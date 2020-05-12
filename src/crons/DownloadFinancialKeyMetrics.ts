import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { DownloadUtils } from './DownloadUtils';

export class DownloadFinancialKeyMetrics implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    await DownloadUtils.uploadValuesHistories(
      'FinancialKeyMetric',
      Api.financialKeyMetricsQuarterly,
      Api.financialKeyMetricsYearly
    );
  }
}
