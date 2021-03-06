import { Meta, MetaName, MetaParam, MetaShell } from './../../lib/data/Meta';
import { Strings } from './../../lib/primitives/Strings';
import { MetaTable } from './../../services/database/MetaTable';
import { TickerTable } from './../../services/database/TickerTable';
import { EodApi } from './../../services/financials/EodApi';
import { Cron } from './../Cron';
import { EodConstants } from './EodConstants';

export class EodMetas extends Cron {
  async run() {
    // Loop over all tickers
    const tickers = await TickerTable.list();
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      // Make sure we only deal with the supported tickers
      if (!EodConstants.tickerTypeWhitelist.has(ticker.type)) {
        continue;
      }

      // Query fundamental API data
      const fundamentals = await EodApi.fundamentals(ticker.code);
      if (!fundamentals) {
        continue;
      }

      // Get existing metas
      const metaForTicker = await MetaTable.mapByKeyForTicker(ticker);

      // Found metas
      const metas: MetaShell[] = [];

      // Automated general keys meta infos
      const general = fundamentals['General'] ?? {};
      for (const key in general) {
        const metaName = EodConstants.objectKeyToMetaName.get(key);
        if (metaName === undefined) {
          continue;
        }
        const value = general[key];
        if (!value) {
          continue;
        }
        const meta: MetaShell = {
          ticker_id: ticker.id,
          name: metaName,
          param: '' as MetaParam,
          content: JSON.stringify(value),
        };
        metas.push(meta);
      }

      // Specific officers meta infos
      const officers = general['Officers'];
      for (const key in officers) {
        const officer = officers[key];
        if (!officer) {
          continue;
        }
        const meta: MetaShell = {
          ticker_id: ticker.id,
          name: MetaName.Officer,
          param: key as MetaParam,
          content: JSON.stringify(officer),
        };
        metas.push(meta);
      }

      // Compute database mutations
      const inserts: MetaShell[] = [];
      const updates: Meta[] = [];
      for (const meta of metas) {
        const existing = metaForTicker.get(MetaTable.key(meta));
        if (existing) {
          if (
            existing.name != meta.name ||
            existing.param != meta.param ||
            existing.content != meta.content
          ) {
            updates.push({ id: existing.id, ...meta });
          }
        } else {
          inserts.push(meta);
        }
      }

      // Database mutations
      await MetaTable.insertBatch(inserts);
      await MetaTable.updateBatch(updates);

      // Log for progress
      console.log(
        `[SYNC]`,
        // Ticker
        Strings.padPostfix(`${ticker.code}`, 15),
        '-',
        Strings.ellipsis(Strings.padPostfix(`${ticker.name}`, 40), 40),
        // Sync status
        Strings.padPrefix(i + 1, 5, '0'),
        '/',
        Strings.padPrefix(tickers.length, 5, '0'),
        // Notes
        '-',
        Strings.padPostfix(`{${ticker.type}}`, 10),
        '-',
        Strings.padPostfix(`<Metas>`, 0)
      );
    }
  }
}
