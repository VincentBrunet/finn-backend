import moment from 'moment';

import { Strings } from './../../lib/primitives/Strings';
import { HttpCache } from './../utils/HttpCache';

export class EodApi {
  static thisMonth() {
    const now = moment();
    return now.format('YYYY-MM');
  }

  static async exchanges() {
    return await EodApi.get('exchanges-list', {}, EodApi.thisMonth());
  }

  static async symbols(exchange: string) {
    return await EodApi.get(
      `exchange-symbol-list/${exchange}`,
      { fmt: 'json' },
      EodApi.thisMonth()
    );
  }

  static async prices(ticker: string) {
    return await EodApi.get(
      `eod/${ticker}`,
      {
        fmt: 'json',
        period: 'm',
      },
      EodApi.thisMonth()
    );
  }

  static async fundamentals(ticker: string) {
    return await EodApi.get(`fundamentals/${ticker}`, {}, EodApi.thisMonth());
  }

  private static async get(route: string, params: { [key: string]: string }, code: string) {
    params['api_token'] = '5ecacede637b58.66703792';
    const param = Object.keys(params)
      .map((key) => {
        return key + '=' + params[key];
      })
      .join('&');
    const url = `https://eodhistoricaldata.com/api/${route}?${param}`;
    const hashed = Strings.hashed(param);
    const data = await HttpCache.getNoThrow(url, 'json', `${hashed}-${code}`);
    return JSON.parse(data ?? '{}');
  }
}
