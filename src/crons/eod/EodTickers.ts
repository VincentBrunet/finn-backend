import { Cron } from '../Cron';

import { EodApi } from '../../services/financials/EodApi';

import { Exchange } from '../../services/database/Exchange';
import { Ticker } from '../../services/database/Ticker';
import { Unit } from '../../services/database/Unit';

const whiteListPlatforms = new Set<string | null>();
whiteListPlatforms.add('NASDAQ'); // USA
whiteListPlatforms.add('NYSE'); // NYC
whiteListPlatforms.add('AMEX'); // NYC
whiteListPlatforms.add('US'); // USA

whiteListPlatforms.add('V'); // Canada
whiteListPlatforms.add('ASX'); // Canada
whiteListPlatforms.add('CSE'); // Canada
whiteListPlatforms.add('LSE'); // London
whiteListPlatforms.add('PA'); // Paris
whiteListPlatforms.add('BE'); // Berlin
whiteListPlatforms.add('HK'); // Hong Kong

whiteListPlatforms.add('MCX'); // Russia (Moscow)
whiteListPlatforms.add('TW'); // Taiwan
whiteListPlatforms.add('IS'); // Turkey (Istanbul)
whiteListPlatforms.add('MX'); // Mexico
whiteListPlatforms.add('BA'); // Argentina
whiteListPlatforms.add('SA'); // Brazil
whiteListPlatforms.add('KLSE'); // Malaysia (Kuala Lumpur)
whiteListPlatforms.add('VN'); // Vietnam
whiteListPlatforms.add('JK'); // Indonesia (Jakarta)
whiteListPlatforms.add('AU'); // Australia
whiteListPlatforms.add('SHG'); // China (Shanghai)
whiteListPlatforms.add('SHE'); // China (Shenzhen)
whiteListPlatforms.add('NSE'); // India
whiteListPlatforms.add('BSE'); // India
whiteListPlatforms.add('JSE'); // South Africa
whiteListPlatforms.add('BK'); // Thailand (Bangkok)
whiteListPlatforms.add('SR'); // Saudi arabia
whiteListPlatforms.add('TSE'); // Japan
whiteListPlatforms.add('AT'); // Greece (Atheenes)
whiteListPlatforms.add('PSE'); // Philipines
whiteListPlatforms.add('KAR'); // Pakistan
whiteListPlatforms.add('SG'); // Singapore
whiteListPlatforms.add('WAR'); // Poland (Warsaw)
whiteListPlatforms.add('KQ'); // Korea
whiteListPlatforms.add('KO'); // Korea
whiteListPlatforms.add('TA'); // Israel (Tel Aviv)
whiteListPlatforms.add('NFN'); // Sweden
whiteListPlatforms.add('CO'); // Denmark (Copenhagen)
whiteListPlatforms.add('OL'); // Normay
whiteListPlatforms.add('IC'); // Iceland
whiteListPlatforms.add('HE'); // Finland (Helsinki?)
whiteListPlatforms.add('IR'); // Ireland
whiteListPlatforms.add('LS'); // Portugal
whiteListPlatforms.add('AS'); // Netherland
whiteListPlatforms.add('MC'); // Spain
whiteListPlatforms.add('SW'); // Switzerland
whiteListPlatforms.add('VX'); // Switzerland
whiteListPlatforms.add('BR'); // Belgium
whiteListPlatforms.add('MI'); // Italy
whiteListPlatforms.add('VI'); // Austria
whiteListPlatforms.add('F'); // Germany (Frankfurt?)
whiteListPlatforms.add('STU'); // Germany
whiteListPlatforms.add('MU'); // Germany
whiteListPlatforms.add('XETRA'); // Germany
whiteListPlatforms.add('HA'); // Germany
whiteListPlatforms.add('HM'); // Germany
whiteListPlatforms.add('DU'); // Germany (Dusseldorf)
whiteListPlatforms.add('TO'); // Canada (Toronto)
whiteListPlatforms.add('ST'); // Sweden
whiteListPlatforms.add('NB'); // Baltic?
whiteListPlatforms.add('BUD'); // Hungary
whiteListPlatforms.add('SN'); // Chile
whiteListPlatforms.add('ZSE'); // Croatia

const blackListPlatforms = new Set<string | null>();
blackListPlatforms.add('LGVW-UN'); // This is clearly a bug from API
blackListPlatforms.add('PINK'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCBB'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCGREY'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCMKTS'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCQB'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCQX'); // is OTC, bad fundamental data
blackListPlatforms.add(null); // is full of weird tickers
blackListPlatforms.add('Futures');
blackListPlatforms.add('FOREX');
blackListPlatforms.add('INDX'); // Indices
blackListPlatforms.add('COMM'); // Commodities
blackListPlatforms.add('CC'); // Crypto-Currencies
blackListPlatforms.add('TWO'); // Taiwan is OTC
blackListPlatforms.add('ETLX'); // Italy certificates?
blackListPlatforms.add('BOND'); // Bonds
blackListPlatforms.add('EUFUND'); // Mostly weird funds
blackListPlatforms.add('MONEY'); // Currencies
blackListPlatforms.add('GBOND'); // Country bonds
blackListPlatforms.add('IL'); // Unknown country stocks

const temporarlyIgnoredPlatforms = new Set<string>();
temporarlyIgnoredPlatforms.add('NMFQS'); // Massive amount of FUNDs
temporarlyIgnoredPlatforms.add('BATS'); // Contains full ETF ?
temporarlyIgnoredPlatforms.add('NYSE ARCA'); // Contains full ETF ?
temporarlyIgnoredPlatforms.add('NYSE MKT'); // Mostly Prefered shares
temporarlyIgnoredPlatforms.add('LU'); // Luxembourg seems to have only funds?

export class EodTickers implements Cron {
  delay = 0;
  repeat = 1000 * 60 * 60;
  async run() {
    const exchanges = await Exchange.list();
    const tickersByCode = await Ticker.mapByCode();
    for (const exchange of exchanges) {
      const symbols = await EodApi.symbols(exchange.code);

      for (const symbol of symbols) {
        const platform = symbol.Exchange;

        if (blackListPlatforms.has(platform)) {
          continue;
        }
        if (temporarlyIgnoredPlatforms.has(platform)) {
          continue;
        }

        if (!whiteListPlatforms.has(platform)) {
          console.log(
            'Should be whitelisted?',
            exchange.code,
            platform,
            symbol.Code,
            symbol.Country,
            symbol.Type,
            symbol.Currency
          );
          continue;
        }

        const unit = await Unit.lookupByCode(symbol.Currency);
        if (!unit) {
          continue;
        }

        const code = symbol.Code + '.' + exchange.code;
        const tickerShell = {
          unit_id: unit.id,
          exchange_id: exchange.id,
          code: code,
          type: symbol.Type,
          name: symbol.Name,
          platform: platform,
        };
        const existing = tickersByCode.get(code);
        if (!existing) {
          console.log('New Ticker', code, symbol.Name, symbol.Exchange, symbol.Type);
          await Ticker.insert(tickerShell);
        } else {
          await Ticker.update({ id: existing.id, ...tickerShell });
        }
      }
    }
  }
}
