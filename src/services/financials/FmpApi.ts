import moment from 'moment';

import { HttpCache } from '../utils/HttpCache';

export class FmpApi {
  static today() {
    const now = moment();
    return now.format('YYYY-MM-DD');
  }

  static async stocks() {
    return (await FmpApi.get(`stock/list`, {}, FmpApi.today())) as any[];
  }

  static async balanceSheetStatementsYearly(ticker: string) {
    return await FmpApi.get(`balance-sheet-statement/${ticker}`, {}, FmpApi.today());
  }
  static async incomeStatementsYearly(ticker: string) {
    return await FmpApi.get(`income-statement/${ticker}`, {}, FmpApi.today());
  }
  static async cashflowStatementsYearly(ticker: string) {
    return await FmpApi.get(`cash-flow-statement/${ticker}`, {}, FmpApi.today());
  }
  static async financialRatiosYearly(ticker: string) {
    return await FmpApi.get(`ratios/${ticker}`, {}, FmpApi.today());
  }
  static async financialKeyMetricsYearly(ticker: string) {
    return await FmpApi.get(`key-metrics/${ticker}`, {}, FmpApi.today());
  }
  static async enterpriseValuesYearly(ticker: string) {
    return await FmpApi.get(`enterprise-values/${ticker}`, {}, FmpApi.today());
  }

  static async balanceSheetStatementsQuarterly(ticker: string) {
    return await FmpApi.get(
      `balance-sheet-statement/${ticker}`,
      { period: 'quarter' },
      FmpApi.today()
    );
  }
  static async incomeStatementsQuarterly(ticker: string) {
    return await FmpApi.get(`income-statement/${ticker}`, { period: 'quarter' }, FmpApi.today());
  }
  static async cashflowStatementsQuarterly(ticker: string) {
    return await FmpApi.get(`cash-flow-statement/${ticker}`, { period: 'quarter' }, FmpApi.today());
  }
  static async financialRatiosQuarterly(ticker: string) {
    return await FmpApi.get(`ratios/${ticker}`, { period: 'quarter' }, FmpApi.today());
  }
  static async financialKeyMetricsQuarterly(ticker: string) {
    return await FmpApi.get(`key-metrics/${ticker}`, { period: 'quarter' }, FmpApi.today());
  }
  static async enterpriseValuesQuarterly(ticker: string) {
    return await FmpApi.get(`enterprise-values/${ticker}`, { period: 'quarter' }, FmpApi.today());
  }

  private static async get(route: string, params: { [key: string]: string }, code: string) {
    params['apikey'] = '0d83ea8e338b5e50c900244649652689';
    const param = Object.keys(params)
      .map((key) => {
        return key + '=' + params[key];
      })
      .join('&');
    const url = `https://fmpcloud.io/api/v3/${route}?${param}`;
    const hashed = Strings.hashed(param);
    const data = await HttpCache.getNoThrow(url, 'json', `${hashed}-${code}`);
    return JSON.parse(data ?? '[]');
  }
}
