import { Cron } from '../Cron';

import { EodApi } from '../../services/financials/EodApi';

import { Unit } from '../../services/database/Unit';
import { Exchange, ExchangeShell } from '../../services/database/Exchange';

export class EodExchanges extends Cron {
  async run() {
    const exchangesByCode = await Exchange.mapByCode();

    const exchanges = await EodApi.exchanges();

    for (const exchange of exchanges) {
      const unit = await Unit.lookupByCode(exchange.Currency);
      if (!unit) {
        continue;
      }
      const exchangeShell: ExchangeShell = {
        unit_id: unit.id,
        code: exchange.Code,
        name: exchange.Name,
        country: exchange.Country,
      };
      const existing = exchangesByCode.get(exchange.Code);
      if (!existing) {
        console.log('New exchange', exchange.Code, exchange.Name, exchange.Country, unit.code);
        await Exchange.insert(exchangeShell);
      } else {
        await Exchange.update({ id: existing.id, ...exchangeShell });
      }
    }
  }
}
