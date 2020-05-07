import { Cron } from './Cron';

import { Api } from '../services/financials/Api';

import { Metric } from '../services/database/Metric';
import { Ticker } from '../services/database/Ticker';

export class BalanceSheets implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    let tickers = await Ticker.bySymbol();
    let metrics = await Metric.byName();

    const stocks = await Api.stocks();
    const tickersNew = stocks.map((v) => {
      return {
        symbol: v.symbol,
        name: v.name ?? v.symbol,
        exchange: v.exchange ?? '',
      };
    });
    tickers = await this.updateTickers(tickers, tickersNew);

    for (let i = 0; i < stocks.length; i++) {
      const balanceSheets = await Api.balanceSheets(stocks[i].symbol);

      const metricsNew = [];
      for (const balanceSheet of balanceSheets) {
        for (const key of Object.keys(balanceSheet)) {
          if (typeof balanceSheet[key] === 'number') {
            metricsNew.push({
              name: key[0].toUpperCase() + key.slice(1),
              category: 'BalanceSheet',
            });
          }
        }
      }
      metrics = await this.updatedMetrics(metrics, metricsNew);

      for (const balanceSheet of balanceSheets) {
        //const date =
        for (const key of Object.keys(balanceSheet)) {
          if (typeof balanceSheet[key] === 'number') {
          }
        }
      }

      if (i > 10) {
        break;
      }
    }
  }

  async updatedMetrics(index: Map<string, Metric>, metrics: Metric[]) {
    for (const metric of metrics) {
      if (!index.has(metric.name)) {
        await Metric.insert(metric);
        index.set(metric.name, metric);
      }
    }
    return Metric.byName();
  }

  async updateTickers(index: Map<string, Ticker>, tickers: Ticker[]) {
    for (const ticker of tickers) {
      if (!index.has(ticker.symbol)) {
        await Ticker.insert(ticker);
        index.set(ticker.symbol, ticker);
      }
    }
    return Ticker.bySymbol();
  }
}
