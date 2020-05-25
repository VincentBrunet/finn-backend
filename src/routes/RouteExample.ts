import { Route } from './Route';

export class RouteExample implements Route {
  async run(param: any) {
    return {
      data: 'Welcome',
      param: param,
    };
  }
}
