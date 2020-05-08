import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { Ticker } from '../services/database/Ticker';

import { DownloadUtils } from './DownloadUtils';

export class DownloadFinancialRatios implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    let tickers = await Ticker.list();
    for (const ticker of tickers) {
      const valuesQuarterlyHistory = await Api.financialRatiosQuarterly(ticker.symbol);
      for (const values of valuesQuarterlyHistory) {
        await DownloadUtils.uploadValues(values, ticker, 'FinancialRatio', 'Quarter');
      }
      const valuesYearlyHistory = await Api.financialRatiosYearly(ticker.symbol);
      for (const values of valuesYearlyHistory) {
        await DownloadUtils.uploadValues(values, ticker, 'FinancialRatio', 'Year');
      }
    }
  }
}
