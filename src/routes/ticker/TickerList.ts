import { Route } from '../Route';
import { TickerTable } from '../../services/database/TickerTable';

export class TickerList implements Route {
  async run(param: any) {
    return await TickerTable.list();
  }
}
