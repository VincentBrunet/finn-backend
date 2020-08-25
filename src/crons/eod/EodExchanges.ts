import { Cron } from '../Cron';
import { EodApi } from '../../services/financials/EodApi';
import { ExchangeShell } from '../../lib/data/Exchange';
import { ExchangeTable } from '../../services/database/ExchangeTable';
import { UnitTable } from '../../services/database/UnitTable';

export class EodExchanges extends Cron {
  async run() {
    const exchangesByCode = await ExchangeTable.mapByCode();

    const exchanges = await EodApi.exchanges();

    for (const exchange of exchanges) {
      const unit = await UnitTable.lookupByCode(exchange.Currency);
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
        await ExchangeTable.insert(exchangeShell);
      } else {
        await ExchangeTable.update({ id: existing.id, ...exchangeShell });
      }
    }
  }
}
