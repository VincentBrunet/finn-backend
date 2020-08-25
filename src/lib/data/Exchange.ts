export interface Exchange extends ExchangeShell {
  id: number;
}
export interface ExchangeShell {
  unit_id: number;
  code: string;
  name: string;
  country: string;
}
