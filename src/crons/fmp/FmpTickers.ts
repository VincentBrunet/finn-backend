import { Cron } from '../Cron';

import { FmpApi } from '../../services/financials/FmpApi';
import { Ticker } from '../../services/database/Ticker';

export class FmpTickers implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    const tickers = await Ticker.mapByCode();
    const stocks = await FmpApi.stocks();
    for (const stock of stocks) {
      if (!tickers.has(stock.symbol)) {
        await Ticker.insert({
          code: stock.symbol,
          name: stock.name,
        });
      }
    }
  }
}
