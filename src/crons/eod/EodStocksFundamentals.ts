import { Strings } from '../../lib/primitives/Strings';
import { TickerTable } from '../../services/database/TickerTable';
import { ValueTable } from '../../services/database/ValueTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';
import { EodUtils } from './EodUtils';

export class EodStocksFundamentals extends Cron {
  async run() {
    const tickers = await TickerTable.list();

    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      if (ticker.type !== 'Common Stock') {
        continue;
      }

      const fundamentals = await EodApi.fundamentals(ticker.code);

      //const general = fundamentals['General'] ?? {};

      const valuesByStampByMetricId = await ValueTable.mapByStampByMetricIdForTicker(ticker);

      const outstandingShares = fundamentals['outstandingShares'] ?? {};
      await EodUtils.uploadValuesHistory(
        ticker,
        outstandingShares['quarterly'],
        'OutstandingShares',
        'Quarterly',
        'shares',
        valuesByStampByMetricId
      );
      await EodUtils.uploadValuesHistory(
        ticker,
        outstandingShares['annual'],
        'OutstandingShares',
        'Yearly',
        'shares',
        valuesByStampByMetricId
      );

      const financials = fundamentals['Financials'] ?? {};
      const financialBalanceSheets = financials['Balance_Sheet'] ?? {};
      const financialCashFlow = financials['Cash_Flow'] ?? {};
      const financialIncomeStatement = financials['Income_Statement'] ?? {};

      await EodUtils.uploadValuesHistories(
        ticker,
        financialBalanceSheets,
        'BalanceSheet',
        valuesByStampByMetricId
      );
      await EodUtils.uploadValuesHistories(
        ticker,
        financialCashFlow,
        'CashFlow',
        valuesByStampByMetricId
      );
      await EodUtils.uploadValuesHistories(
        ticker,
        financialIncomeStatement,
        'IncomeStatement',
        valuesByStampByMetricId
      );

      const earnings = fundamentals['Earnings'] ?? {};
      await EodUtils.uploadValuesHistory(
        ticker,
        earnings['History'],
        'Earning',
        'Quarterly',
        financialCashFlow['currency_symbol'],
        valuesByStampByMetricId
      );
      await EodUtils.uploadValuesHistory(
        ticker,
        earnings['Annual'],
        'Earning',
        'Yearly',
        financialCashFlow['currency_symbol'],
        valuesByStampByMetricId
      );

      console.log(
        `[SYNC]`,
        // Ticker
        Strings.padPostfix(`${ticker.code}`, 10),
        '-',
        Strings.ellipsis(Strings.padPostfix(`${ticker.name}`, 45), 45),
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
