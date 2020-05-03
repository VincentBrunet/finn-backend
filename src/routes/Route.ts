export interface Route {
  run(params: any): Promise<any>;
}
