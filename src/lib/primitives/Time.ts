import { Branded } from './../struct/Branded';

export type TimestampMs = Branded<number, 'TimestampMs'>;
export type TimestampSec = Branded<number, 'TimestampSec'>;

export type DurationMs = Branded<number, 'DurationMs'>;
export type DurationSec = Branded<number, 'DurationSec'>;

export function nowTimestampMs() {
  return new Date().getTime() as TimestampMs;
}
