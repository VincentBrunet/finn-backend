import { App } from './App';
import { EodExchanges } from './crons/eod/EodExchanges';
import { EodFundamentals } from './crons/eod/EodFundamentals';
import { EodMetas } from './crons/eod/EodMetas';
import { EodPrices } from './crons/eod/EodPrices';
import { EodTickers } from './crons/eod/EodTickers';

export class AppWriter extends App {
  protected setup() {
    // Units
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    // Layers
    const pass1 = 0.1 * second;
    const pass2 = 3 * second;
    const pass3 = 6 * second;
    const repeater = 1 * hour;
    // Schedule first pass
    this.run('/eod/exchanges', EodExchanges, pass1, repeater);
    // Schedule second pass
    this.run('/eod/tickers', EodTickers, pass2, repeater);
    // Schedule third pass
    this.run('/eod/metas', EodMetas, pass3, repeater);
    this.run('/eod/prices', EodPrices, pass3, repeater);
    this.run('/eod/fundamentals', EodFundamentals, pass3, repeater);
  }
}
