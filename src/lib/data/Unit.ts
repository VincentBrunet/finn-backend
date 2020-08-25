export interface Unit extends UnitShell {
  id: number;
}
export interface UnitShell {
  code: string;
  name?: string;
  symbol?: string;
}
