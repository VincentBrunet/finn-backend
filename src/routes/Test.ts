import { Api } from '../services/financials/Api';

import { Route } from './Route';

export class Test implements Route {
  async run(param: any) {
    const stocks = await Api.stocks();
    return stocks.map((v) => v.symbol);
  }
}
