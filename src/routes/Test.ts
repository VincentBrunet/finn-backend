import { Api } from "../services/financials/Api";

import { Route } from "./Route";

export class Test implements Route {
  async run(param: any) {
    const stocks = await Api.stocks();
    console.log("stocks", stocks.length);
    const balanceSheets = [];
    for (const stock of stocks) {
      balanceSheets.push(await Api.balanceSheet(stock.symbol));
    }
    console.log("balanceSheets", balanceSheets.length);
    return stocks.reduce((map, v) => {
      map[v.symbol] = (map[v.symbol] ?? 0) + 1;
      return map;
    }, {});
  }
}
