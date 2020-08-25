import { App } from './App';
import { EodExchanges } from './crons/eod/EodExchanges';
import { EodStocksPrices } from './crons/eod/EodStocksPrices';
import { EodTickers } from './crons/eod/EodTickers';

export class AppWriter extends App {
  protected setup() {
    // Units
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    // Layers
    const firstPass = 0;
    const secondPass = 3 * second;
    const thirdPass = 6 * second;
    const repeater = hour;
    // Schedule first pass
    this.run('/eod/exchanges', EodExchanges, firstPass, repeater);
    // Schedule second pass
    this.run('/eod/tickers', EodTickers, secondPass, repeater);
    // Schedule third pass
    this.run('/eod/stocks-prices', EodStocksPrices, thirdPass, repeater);
    //this.run('/eod/stocks-fundamentals', EodStocksFundamentals, thirdPass, repeater);
  }
}
