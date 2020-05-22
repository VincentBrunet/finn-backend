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

  static async balanceSheetStatementsYearly(ticker: string) {
    return await Api.get(`balance-sheet-statement/${ticker}`, {}, Api.today());
  }
  static async incomeStatementsYearly(ticker: string) {
    return await Api.get(`income-statement/${ticker}`, {}, Api.today());
  }
  static async cashflowStatementsYearly(ticker: string) {
    return await Api.get(`cash-flow-statement/${ticker}`, {}, Api.today());
  }
  static async financialRatiosYearly(ticker: string) {
    return await Api.get(`ratios/${ticker}`, {}, Api.today());
  }
  static async financialKeyMetricsYearly(ticker: string) {
    return await Api.get(`key-metrics/${ticker}`, {}, Api.today());
  }
  static async enterpriseValuesYearly(ticker: string) {
    return await Api.get(`enterprise-values/${ticker}`, {}, Api.today());
  }

  static async balanceSheetStatementsQuarterly(ticker: string) {
    return await Api.get(`balance-sheet-statement/${ticker}`, { period: 'quarter' }, Api.today());
  }
  static async incomeStatementsQuarterly(ticker: string) {
    return await Api.get(`income-statement/${ticker}`, { period: 'quarter' }, Api.today());
  }
  static async cashflowStatementsQuarterly(ticker: string) {
    return await Api.get(`cash-flow-statement/${ticker}`, { period: 'quarter' }, Api.today());
  }
  static async financialRatiosQuarterly(ticker: string) {
    return await Api.get(`ratios/${ticker}`, { period: 'quarter' }, Api.today());
  }
  static async financialKeyMetricsQuarterly(ticker: string) {
    return await Api.get(`key-metrics/${ticker}`, { period: 'quarter' }, Api.today());
  }
  static async enterpriseValuesQuarterly(ticker: string) {
    return await Api.get(`enterprise-values/${ticker}`, { period: 'quarter' }, Api.today());
  }

  private static async get(route: string, params: { [key: string]: string }, code: string) {
    params['apikey'] = '0d83ea8e338b5e50c900244649652689';
    const param = Object.keys(params)
      .map((key) => {
        return key + '=' + params[key];
      })
      .join('&');
    const url = `https://fmpcloud.io/api/v3/${route}?${param}`;
    const hashed = Api.hashed(param);
    const data = await HttpCache.getNoThrow(url, 'json', `${hashed}-${code}`);
    return JSON.parse(data ?? '[]');
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
