export interface Metric extends MetricShell {
  id: number;
}
export interface MetricShell {
  name: string;
  category: string;
  period: string;
}
