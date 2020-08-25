import { Branded } from '../struct/Branded';
import { MapMap } from '../struct/MapMap';
import { MapMapMap } from '../struct/MapMapMap';
import { MetricId } from './Metric';
import { TickerId } from './Ticker';
import { UnitId } from './Unit';

export type ValueId = Branded<number, 'ValueId'>;
export type ValueStamp = Branded<number, 'ValueStamp'>;
export type ValueValue = Branded<number, 'ValueValue'>;
export interface Value extends ValueShell {
  id: number;
}
export interface ValueShell {
  ticker_id: TickerId;
  metric_id: MetricId;
  unit_id: UnitId;
  stamp: ValueStamp;
  value: ValueValue;
}

export class ValueChunkTicker extends MapMap<MetricId, ValueStamp, Value> {}
export class ValueChunkTickers extends MapMapMap<TickerId, MetricId, ValueStamp, Value> {}
