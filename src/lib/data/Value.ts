export interface Value extends ValueShell {
  id: number;
}
export interface ValueShell {
  ticker_id: number;
  metric_id: number;
  unit_id: number;
  stamp: number;
  value: number;
}
