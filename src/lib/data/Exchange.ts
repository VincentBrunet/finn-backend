import { Branded } from './../struct/Branded';
import { UnitId } from './Unit';

export type ExchangeId = Branded<number, 'ExchangeId'>;
export interface Exchange extends ExchangeShell {
  id: ExchangeId;
}
export interface ExchangeShell {
  unit_id: UnitId;
  code: string;
  name: string;
  country: string;
}
