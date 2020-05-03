import * as express from "express";

import { Route } from "./routes/Route";

import { Test } from "./Routes/Test";

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.get("/", this.make(new Test()));
  }

  private make(
    route: Route
  ): (req: express.Request, res: express.Response) => void {
    return async (req: express.Request, res: express.Response) => {
      try {
        const params = req.query || req.params;
        const json = await route.run(params);
        res.status(200);
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(json, undefined, 2));
      } catch (e) {
        res.status(500);
        res.json(e.toString());
        res.end();
      }
    };
  }

  public listen(port: number, done: () => void) {
    this.app.listen(port, done);
  }
}
