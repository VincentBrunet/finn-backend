import { MetricCategory, MetricPeriod } from '../../lib/data/Metric';
import { Strings } from '../../lib/primitives/Strings';
import { TickerTable } from '../../services/database/TickerTable';
import { UnitTable } from '../../services/database/UnitTable';
import { ValueTable } from '../../services/database/ValueTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';
import { EodConstants } from './EodConstants';
import { EodUtils } from './EodUtils';

export class EodFundamentals extends Cron {
  async run() {
    // Useful values
    const unitNone = await UnitTable.lookupByCode('');
    // Loop over all existing tickers
    const tickers = await TickerTable.list();
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      // Make sure we only deal with the supported tickers
      if (!EodConstants.tickerTypeWhitelist.has(ticker.type)) {
        continue;
      }

      // Query existing ticker values
      const chunkTicker = await ValueTable.chunkTicker(ticker);

      // Query fundamental API data
      const fundamentals = await EodApi.fundamentals(ticker.code);
      if (!fundamentals) {
        continue;
      }

      // Outstanding shares standard dual-object
      const outstandingShares = fundamentals['outstandingShares'] ?? {};
      await EodUtils.uploadValuesHistory(
        ticker,
        outstandingShares['quarterly'],
        MetricCategory.OutstandingShares,
        MetricPeriod.Quarterly,
        unitNone,
        chunkTicker
      );
      await EodUtils.uploadValuesHistory(
        ticker,
        outstandingShares['annual'],
        MetricCategory.OutstandingShares,
        MetricPeriod.Yearly,
        unitNone,
        chunkTicker
      );

      const financials = fundamentals['Financials'] ?? {};

      // BalanceSheet standard year-quarter combo
      const financialBalanceSheets = financials['Balance_Sheet'] ?? {};
      await EodUtils.uploadValuesHistories(
        ticker,
        financialBalanceSheets,
        MetricCategory.BalanceSheet,
        chunkTicker
      );

      // CashFlow standard year-quarter combo
      const financialCashFlow = financials['Cash_Flow'] ?? {};
      await EodUtils.uploadValuesHistories(
        ticker,
        financialCashFlow,
        MetricCategory.CashFlow,
        chunkTicker
      );

      // IncomeStatement standard year-quarter combo
      const financialIncomeStatement = financials['Income_Statement'] ?? {};
      await EodUtils.uploadValuesHistories(
        ticker,
        financialIncomeStatement,
        MetricCategory.IncomeStatement,
        chunkTicker
      );

      // Earning standard dual-object
      const earnings = fundamentals['Earnings'] ?? {};
      await EodUtils.uploadValuesHistory(
        ticker,
        earnings['History'],
        MetricCategory.Earning,
        MetricPeriod.Quarterly,
        unitNone,
        chunkTicker
      );
      await EodUtils.uploadValuesHistory(
        ticker,
        earnings['Annual'],
        MetricCategory.Earning,
        MetricPeriod.Yearly,
        unitNone,
        chunkTicker
      );

      // Log for progress
      console.log(
        `[SYNC]`,
        // Ticker
        Strings.padPostfix(`${ticker.code}`, 15),
        '-',
        Strings.ellipsis(Strings.padPostfix(`${ticker.name}`, 40), 40),
        // Sync status
        Strings.padPrefix(i + 1, 5, '0'),
        '/',
        Strings.padPrefix(tickers.length, 5, '0'),
        // Notes
        '-',
        Strings.padPostfix(`{${ticker.type}}`, 10),
        '-',
        Strings.padPostfix(`<Fundamentals>`, 0)
      );
    }
  }
}
