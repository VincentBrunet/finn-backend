import { Route } from '../Route';

import { Metric } from '../../services/database/Metric';

export class MetricList implements Route {
  async run(param: any) {
    return await Metric.list();
  }
}
