import { Cron } from './Cron';

import { Api } from '../services/financials/Api';
import { Ticker } from '../services/database/Ticker';

export class DownloadTickers implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    const tickers = await Ticker.bySymbol();
    const stocks = await Api.stocks();
    for (const stock of stocks) {
      if (!tickers.has(stock.symbol)) {
        await Ticker.insert({
          symbol: stock.symbol,
          name: stock.name ?? stock.symbol,
          exchange: stock.exchange ?? '',
        });
      }
    }
  }
}
