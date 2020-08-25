import { Branded } from '../struct/Branded';

export type MetricId = Branded<number, 'MetricId'>;
export interface Metric extends MetricShell {
  id: MetricId;
}
export interface MetricShell {
  name: string;
  category: MetricCategory;
  period: MetricPeriod;
}

export enum MetricPeriod {
  Quarterly = 'quarter',
  Yearly = 'year',
}

export enum MetricCategory {
  OutstandingShares = 'outstanding-shares',
  CashFlow = 'cash-flow',
  IncomeStatement = 'income-statement',
  BalanceSheet = 'balance-sheet',
  Earning = 'earning',
  Trading = 'trading',
}
