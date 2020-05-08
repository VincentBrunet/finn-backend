import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { Ticker } from '../services/database/Ticker';

import { DownloadUtils } from './DownloadUtils';

export class DownloadBalanceSheetStatements implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    let tickers = await Ticker.list();
    for (const ticker of tickers) {
      const valuesQuarterlyHistory = await Api.balanceSheetStatementsQuarterly(ticker.symbol);
      for (const values of valuesQuarterlyHistory) {
        await DownloadUtils.uploadValues(values, ticker, 'BalanceSheetStatement', 'Quarter');
      }
      const valuesYearlyHistory = await Api.balanceSheetStatementsYearly(ticker.symbol);
      for (const values of valuesYearlyHistory) {
        await DownloadUtils.uploadValues(values, ticker, 'BalanceSheetStatement', 'Year');
      }
    }
  }
}
