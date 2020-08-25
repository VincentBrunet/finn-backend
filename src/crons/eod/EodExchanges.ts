import { ExchangeShell } from '../../lib/data/Exchange';
import { ExchangeTable } from '../../services/database/ExchangeTable';
import { UnitTable } from '../../services/database/UnitTable';
import { EodApi } from '../../services/financials/EodApi';
import { Cron } from '../Cron';

export class EodExchanges extends Cron {
  async run() {
    // Indexes
    const exchangesByCode = await ExchangeTable.mapByCode();
    // Loop over API data
    const exchangesApi = await EodApi.exchanges();
    for (const exchangeApi of exchangesApi) {
      // Resolve currency
      const unit = await UnitTable.lookupByCode(exchangeApi.Currency);
      // Data format
      const exchange: ExchangeShell = {
        unit_id: unit.id,
        code: exchangeApi.Code,
        name: exchangeApi.Name,
        country: exchangeApi.Country,
      };
      // Check if it already exists, if so, just update it
      const existing = exchangesByCode.get(exchangeApi.Code);
      if (existing) {
        await ExchangeTable.update({ id: existing.id, ...exchange });
        continue;
      }
      // Insert the newly found exchange
      await ExchangeTable.insert(exchange);
    }
  }
}
