import moment from 'moment';

import { HttpCache } from '../utils/HttpCache';

export class EodApi {
  static thisMonth() {
    const now = moment();
    return now.format('YYYY-MM');
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
    const hashed = EodApi.hashed(param);
    const data = await HttpCache.getNoThrow(url, 'json', `${hashed}-${code}`);
    return JSON.parse(data ?? '{}');
  }

  private static hashed(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).slice(0, 4);
  }
}
