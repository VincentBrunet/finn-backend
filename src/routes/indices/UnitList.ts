import { UnitTable } from './../../services/database/UnitTable';
import { Route } from './../Route';

export class UnitList implements Route {
  async run(param: any) {
    return await UnitTable.list();
  }
}
