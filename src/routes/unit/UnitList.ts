import { Route } from '../Route';

import { Unit } from '../../services/database/Unit';

export class UnitList implements Route {
  async run(param: any) {
    return await Unit.list();
  }
}
