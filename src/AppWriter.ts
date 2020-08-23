import { EodExchanges } from './crons/eod/EodExchanges';
import { EodTickers } from './crons/eod/EodTickers';
import { EodStocksPrices } from './crons/eod/EodStocksPrices';
import { EodStocksFundamentals } from './crons/eod/EodStocksFundamentals';

import { App } from './App';

export class AppWriter extends App {
  protected setup() {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    this.run('/eod/exchanges', EodExchanges, 0, hour);
    this.run('/eod/tickers', EodTickers, 5 * second, hour);
    this.run('/eod/stocks-prices', EodStocksPrices, 10 * second, hour);
    this.run('/eod/stocks-fundamentals', EodStocksFundamentals, 10 * second, hour);
  }
}
