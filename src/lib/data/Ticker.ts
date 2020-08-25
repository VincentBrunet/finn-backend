export interface Ticker extends TickerShell {
  id: number;
}
export interface TickerShell {
  exchange_id: number;
  unit_id: number;
  code: string;
  type: string;
  name: string;
  platform: string;
}
