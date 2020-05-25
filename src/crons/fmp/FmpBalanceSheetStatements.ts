import { Cron } from '../Cron';

import { FmpApi } from '../../services/financials/FmpApi';

import { FmpUtils } from './FmpUtils';

export class FmpBalanceSheetStatements implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    await FmpUtils.uploadValuesHistories(
      'BalanceSheetStatement',
      FmpApi.balanceSheetStatementsQuarterly,
      FmpApi.balanceSheetStatementsYearly
    );
  }
}
