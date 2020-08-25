import { TickerShell } from './../../lib/data/Ticker';
import { TickerType } from '../../lib/data/Ticker';
import { ExchangeTable } from '../../services/database/ExchangeTable';
import { TickerTable } from '../../services/database/TickerTable';
import { UnitTable } from '../../services/database/UnitTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';
import { EodConstants } from './EodConstants';

export class EodTickers extends Cron {
  async run() {
    const exchanges = await ExchangeTable.list();
    const tickersByCode = await TickerTable.mapByCode();
    for (const exchange of exchanges) {
      const symbols = await EodApi.symbols(exchange.code);

      for (const symbol of symbols) {
        const platform = symbol.Exchange;

        if (EodConstants.symbolExchangeBlacklist.has(platform)) {
          continue;
        }
        if (EodConstants.symbolExchangeExperimentals.has(platform)) {
          continue;
        }

        if (!EodConstants.symbolExchangeWhiteList.has(platform)) {
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

        const tickerType = EodConstants.symbolTypeToTickerType.get(symbol.Type);
        if (tickerType !== TickerType.CommonStock) {
          continue;
        }

        const unit = await UnitTable.lookupByCode(symbol.Currency);

        const code = symbol.Code + '.' + exchange.code;
        const tickerShell: TickerShell = {
          unit_id: unit.id,
          exchange_id: exchange.id,
          code: code,
          type: tickerType,
          name: symbol.Name,
          platform: platform,
        };

        const existing = tickersByCode.get(code);
        if (!existing) {
          await TickerTable.insert(tickerShell);
        } else {
          await TickerTable.update({ id: existing.id, ...tickerShell });
        }
      }
    }
  }
}
