import { Cron } from '../Cron';

import { FmpApi } from '../../services/financials/FmpApi';

import { FmpUtils } from './FmpUtils';

export class FmpFinancialRatios implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    await FmpUtils.uploadValuesHistories(
      'FinancialRatio',
      FmpApi.financialRatiosQuarterly,
      FmpApi.financialRatiosYearly
    );
  }
}
