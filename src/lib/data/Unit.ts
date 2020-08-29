import { Branded } from './../struct/Branded';

export type UnitId = Branded<number, 'UnitId'>;
export interface Unit extends UnitShell {
  id: UnitId;
}
export interface UnitShell {
  code: string;
  name?: string;
  symbol?: string;
}
