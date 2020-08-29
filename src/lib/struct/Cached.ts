import { DurationMs, TimestampMs, nowTimestampMs } from '../primitives/Time';

export class CachedSync<T> {
  lastTime?: TimestampMs;
  lastValue?: T;
  constructor(private duration: DurationMs, private getter: () => T) {}
  get(): T {
    const now = nowTimestampMs();
    if (this.lastTime) {
      if (this.lastTime + this.duration > now) {
        if (this.lastValue) {
          return this.lastValue;
        }
      }
    }
    this.lastTime = now;
    this.lastValue = this.getter();
    return this.lastValue;
  }
}

export class CachedAsync<T> {
  lastTime?: TimestampMs;
  lastValue?: T;
  constructor(private duration: DurationMs, private getter: () => Promise<T>) {}
  async get(): Promise<T> {
    const now = nowTimestampMs();
    if (this.lastTime) {
      if (this.lastTime + this.duration > now) {
        if (this.lastValue) {
          return this.lastValue;
        }
      }
    }
    this.lastTime = now;
    this.lastValue = await this.getter();
    return this.lastValue;
  }
}
