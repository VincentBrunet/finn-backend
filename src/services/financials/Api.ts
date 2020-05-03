import * as moment from "moment";

import { HttpCache } from "../utils/HttpCache";

export class Api {
  public static today() {
    const now = moment();
    return now.format("YYYY-MM-DD");
  }
  public static async stocks() {
    return await Api.get(`stock/list`, Api.today());
  }
  public static async balanceSheet(ticker: string) {
    return await Api.get(`balance-sheet-statement/${ticker}`, Api.today());
  }
  private static async get(route: string, code: string) {
    const url = `https://fmpcloud.io/api/v3/${route}?apikey=0d83ea8e338b5e50c900244649652689`;
    const data = await HttpCache.get(url, "json", code);
    //console.log("GET", route, code, data.length);
    return JSON.parse(data);
  }
}
