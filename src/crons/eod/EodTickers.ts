import { Cron } from '../Cron';
import { EodApi } from '../../services/financials/EodApi';
import { ExchangeTable } from '../../services/database/ExchangeTable';
import { TickerTable } from '../../services/database/TickerTable';
import { UnitTable } from '../../services/database/UnitTable';

const whiteListPlatforms = new Set<string | null>();
const blackListPlatforms = new Set<string | null>();
const temporarlyIgnoredPlatforms = new Set<string>();

whiteListPlatforms.add('NASDAQ'); // USA
whiteListPlatforms.add('NYSE'); // NYC
whiteListPlatforms.add('AMEX'); // NYC
whiteListPlatforms.add('US'); // USA

temporarlyIgnoredPlatforms.add('V'); // Canada
temporarlyIgnoredPlatforms.add('ASX'); // Canada
temporarlyIgnoredPlatforms.add('CSE'); // Canada
temporarlyIgnoredPlatforms.add('LSE'); // London
temporarlyIgnoredPlatforms.add('PA'); // Paris
temporarlyIgnoredPlatforms.add('BE'); // Berlin
temporarlyIgnoredPlatforms.add('HK'); // Hong Kong

temporarlyIgnoredPlatforms.add('MCX'); // Russia (Moscow)
temporarlyIgnoredPlatforms.add('TW'); // Taiwan
temporarlyIgnoredPlatforms.add('IS'); // Turkey (Istanbul)
temporarlyIgnoredPlatforms.add('MX'); // Mexico
temporarlyIgnoredPlatforms.add('BA'); // Argentina
temporarlyIgnoredPlatforms.add('SA'); // Brazil
temporarlyIgnoredPlatforms.add('KLSE'); // Malaysia (Kuala Lumpur)
temporarlyIgnoredPlatforms.add('VN'); // Vietnam
temporarlyIgnoredPlatforms.add('JK'); // Indonesia (Jakarta)
temporarlyIgnoredPlatforms.add('AU'); // Australia
temporarlyIgnoredPlatforms.add('SHG'); // China (Shanghai)
temporarlyIgnoredPlatforms.add('SHE'); // China (Shenzhen)
temporarlyIgnoredPlatforms.add('NSE'); // India
temporarlyIgnoredPlatforms.add('BSE'); // India
temporarlyIgnoredPlatforms.add('JSE'); // South Africa
temporarlyIgnoredPlatforms.add('BK'); // Thailand (Bangkok)
temporarlyIgnoredPlatforms.add('SR'); // Saudi arabia
temporarlyIgnoredPlatforms.add('TSE'); // Japan
temporarlyIgnoredPlatforms.add('AT'); // Greece (Atheenes)
temporarlyIgnoredPlatforms.add('PSE'); // Philipines
temporarlyIgnoredPlatforms.add('KAR'); // Pakistan
temporarlyIgnoredPlatforms.add('SG'); // Singapore
temporarlyIgnoredPlatforms.add('WAR'); // Poland (Warsaw)
temporarlyIgnoredPlatforms.add('KQ'); // Korea
temporarlyIgnoredPlatforms.add('KO'); // Korea
temporarlyIgnoredPlatforms.add('TA'); // Israel (Tel Aviv)
temporarlyIgnoredPlatforms.add('NFN'); // Sweden
temporarlyIgnoredPlatforms.add('CO'); // Denmark (Copenhagen)
temporarlyIgnoredPlatforms.add('OL'); // Normay
temporarlyIgnoredPlatforms.add('IC'); // Iceland
temporarlyIgnoredPlatforms.add('HE'); // Finland (Helsinki?)
temporarlyIgnoredPlatforms.add('IR'); // Ireland
temporarlyIgnoredPlatforms.add('LS'); // Portugal
temporarlyIgnoredPlatforms.add('AS'); // Netherland
temporarlyIgnoredPlatforms.add('MC'); // Spain
temporarlyIgnoredPlatforms.add('SW'); // Switzerland
temporarlyIgnoredPlatforms.add('VX'); // Switzerland
temporarlyIgnoredPlatforms.add('BR'); // Belgium
temporarlyIgnoredPlatforms.add('MI'); // Italy
temporarlyIgnoredPlatforms.add('VI'); // Austria
temporarlyIgnoredPlatforms.add('F'); // Germany (Frankfurt?)
temporarlyIgnoredPlatforms.add('STU'); // Germany
temporarlyIgnoredPlatforms.add('MU'); // Germany
temporarlyIgnoredPlatforms.add('XETRA'); // Germany
temporarlyIgnoredPlatforms.add('HA'); // Germany
temporarlyIgnoredPlatforms.add('HM'); // Germany
temporarlyIgnoredPlatforms.add('DU'); // Germany (Dusseldorf)
temporarlyIgnoredPlatforms.add('TO'); // Canada (Toronto)
temporarlyIgnoredPlatforms.add('ST'); // Sweden
temporarlyIgnoredPlatforms.add('NB'); // Baltic?
temporarlyIgnoredPlatforms.add('BUD'); // Hungary
temporarlyIgnoredPlatforms.add('SN'); // Chile
temporarlyIgnoredPlatforms.add('ZSE'); // Croatia
temporarlyIgnoredPlatforms.add('LIM'); // Peru

blackListPlatforms.add(null); // is full of weird tickers
blackListPlatforms.add('LGVW-UN'); // This is clearly a bug from API
blackListPlatforms.add('PINK'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCBB'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCGREY'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCMKTS'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCQB'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCQX'); // is OTC, bad fundamental data
blackListPlatforms.add('OTCCE'); // is OTC, bad fundamental data
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

temporarlyIgnoredPlatforms.add('NMFQS'); // Massive amount of FUNDs
temporarlyIgnoredPlatforms.add('BATS'); // Contains full ETF ?
temporarlyIgnoredPlatforms.add('NYSE ARCA'); // Contains full ETF ?
temporarlyIgnoredPlatforms.add('NYSE MKT'); // Mostly Prefered shares
temporarlyIgnoredPlatforms.add('LU'); // Luxembourg seems to have only funds?

export class EodTickers extends Cron {
  async run() {
    const exchanges = await ExchangeTable.list();
    const tickersByCode = await TickerTable.mapByCode();
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

        const unit = await UnitTable.lookupByCode(symbol.Currency);
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
          await TickerTable.insert(tickerShell);
        } else {
          await TickerTable.update({ id: existing.id, ...tickerShell });
        }
      }
    }
  }
}
