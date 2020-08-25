import { Route } from '../Route';

import { UnitTable } from '../../services/database/UnitTable';

export class UnitList implements Route {
  async run(param: any) {
    return await UnitTable.list();
  }
}
