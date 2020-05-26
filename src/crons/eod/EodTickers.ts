import { Cron } from '../Cron';

import { EodApi } from '../../services/financials/EodApi';
import { Ticker } from '../../services/database/Ticker';

const exchanges = ['US', 'PA', 'LSE', 'BE'];

export class EodTickers implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    const tickersByCode = await Ticker.mapByCode();
    for (const exchange of exchanges) {
      const symbols = await EodApi.symbols(exchange);
      for (const symbol of symbols) {
        const code = symbol.Code + '.' + exchange;
        const tickerShell = {
          code: code,
          type: symbol.Type,
          name: symbol.Name,
          country: symbol.Country,
          exchange: symbol.Exchange,
        };
        const ticker = tickersByCode.get(code);
        if (!ticker) {
          await Ticker.insert(tickerShell);
        } else {
          if (ticker.name != tickerShell.name) {
            console.error('Ticker conflict', ticker, tickerShell);
          }
          await Ticker.update({ id: ticker.id, ...tickerShell });
        }
      }
    }
  }
}
