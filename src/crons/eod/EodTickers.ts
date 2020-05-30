import { Cron } from '../Cron';

import { EodApi } from '../../services/financials/EodApi';
import { Ticker } from '../../services/database/Ticker';

const regions = ['US', 'PA', 'LSE', 'BE'];

const whiteListExchanges = new Set<string | null>();
whiteListExchanges.add('NASDAQ'); // USA
whiteListExchanges.add('NYSE'); // NYC
whiteListExchanges.add('AMEX'); // NYC
whiteListExchanges.add('US'); // USA
whiteListExchanges.add('ASX'); // Canada
whiteListExchanges.add('CSE'); // Canada
whiteListExchanges.add('LSE'); // London
whiteListExchanges.add('PA'); // Paris
whiteListExchanges.add('BE'); // Berlin

const blackListExchanges = new Set<string | null>();
blackListExchanges.add('LGVW-UN'); // This is clearly a bug from API
blackListExchanges.add('PINK'); // is OTC, bad fundamental data
blackListExchanges.add('OTCBB'); // is OTC, bad fundamental data
blackListExchanges.add('OTCGREY'); // is OTC, bad fundamental data
blackListExchanges.add('OTCMKTS'); // is OTC, bad fundamental data
blackListExchanges.add('OTCQB'); // is OTC, bad fundamental data
blackListExchanges.add('OTCQX'); // is OTC, bad fundamental data
blackListExchanges.add(null); // is full of weird tickers

const temporarlyIgnoredExchanges = new Set<string>();
temporarlyIgnoredExchanges.add('NMFQS'); // Massive amount of FUNDs
temporarlyIgnoredExchanges.add('BATS'); // Contains full ETF ?
temporarlyIgnoredExchanges.add('NYSE ARCA'); // Contains full ETF ?
temporarlyIgnoredExchanges.add('NYSE MKT'); // Mostly Prefered shares

export class EodTickers implements Cron {
  delay = 0;
  repeat = 10000;
  async run() {
    const tickersByCode = await Ticker.mapByCode();
    for (const region of regions) {
      const symbols = await EodApi.symbols(region);

      for (const symbol of symbols) {
        const exchange = symbol.Exchange;

        if (blackListExchanges.has(exchange)) {
          continue;
        }
        if (temporarlyIgnoredExchanges.has(exchange)) {
          continue;
        }

        if (!whiteListExchanges.has(exchange)) {
          console.log('UNKNOWN', region, exchange, symbol.Code, symbol.Country, symbol.Type);
        }

        const code = symbol.Code + '.' + region;
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
          await Ticker.update({ id: ticker.id, ...tickerShell });

          if (ticker.name != tickerShell.name) {
            console.error('Ticker name conflict', ticker, tickerShell);
          }
        }
      }
    }
  }
}
