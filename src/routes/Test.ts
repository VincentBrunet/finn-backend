import { Api } from '../services/financials/Api';

import { Route } from './Route';

export class Test implements Route {
  async run(param: any) {
    const stocks = await Api.stocks();
    setTimeout(async () => {
      const balanceSheets = [];
      for (let i = 0; i < stocks.length; i++) {
        console.log('Stock', stocks[i].symbol, i, stocks.length);
        balanceSheets.push(await Api.balanceSheet(stocks[i].symbol));
      }
    });
    return stocks.map((v) => v.symbol);
  }
}
