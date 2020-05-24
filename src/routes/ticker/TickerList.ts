import { Route } from '../Route';

import { Ticker } from '../../services/database/Ticker';

export class TickerList implements Route {
  async run(param: any) {
    return await Ticker.list();
  }
}
