import { Branded } from '../struct/Branded';
import { ExchangeId } from './Exchange';
import { UnitId } from './Unit';

export type TickerId = Branded<number, 'TickerId'>;
export interface Ticker extends TickerShell {
  id: TickerId;
}
export interface TickerShell {
  exchange_id: ExchangeId;
  unit_id: UnitId;
  type: TickerType;
  code: string;
  name: string;
  platform: string;
}

export enum TickerType {
  Currency = 'currency',
  CommonStock = 'common-stock',
}
