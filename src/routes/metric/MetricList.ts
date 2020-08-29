import { MetricTable } from './../../services/database/MetricTable';
import { Route } from './../Route';

export class MetricList implements Route {
  async run(param: any) {
    return await MetricTable.list();
  }
}
