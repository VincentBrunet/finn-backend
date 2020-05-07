import moment from 'moment';

import { HttpCache } from '../utils/HttpCache';

export class Api {
  static today() {
    const now = moment();
    return now.format('YYYY-MM-DD');
  }
  static async stocks() {
    return (await Api.get(`stock/list`, {}, Api.today())) as any[];
  }
  static async balanceSheets(ticker: string) {
    return await Api.get(`balance-sheet-statement/${ticker}`, {}, Api.today());
  }
  static async balanceSheetsQuarterly(ticker: string) {
    return await Api.get(`balance-sheet-statement/${ticker}`, { period: 'quarter' }, Api.today());
  }
  private static async get(route: string, params: { [key: string]: string }, code: string) {
    params['apikey'] = '0d83ea8e338b5e50c900244649652689';

    const param = Object.keys(params)
      .map((key) => {
        return key + '=' + params[key];
      })
      .join('&');

    const url = `https://fmpcloud.io/api/v3/${route}?${param}`;
    const data = await HttpCache.get(url, 'json', code);
    return JSON.parse(data);
  }
}
