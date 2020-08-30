import { TickerTable } from './../../services/database/TickerTable';
import { Route } from './../Route';

export class TickerList implements Route {
  async run(param: any) {
    return await TickerTable.list();
  }
}
