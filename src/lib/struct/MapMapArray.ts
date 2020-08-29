import { MapMap } from './MapMap';

export class MapMapArray<K1, K2, V> {
  private map: MapMap<K1, K2, V[]> = new MapMap();
  constructor() {}
  public push(key1: K1, key2: K2, value: V) {
    const array = this.map.get(key1, key2);
    if (array !== undefined) {
      array.push(value);
    } else {
      this.map.set(key1, key2, [value]);
    }
  }
  public list(key1: K1, key2: K2) {
    return this.map.get(key1, key2);
  }
  public clear() {
    return this.map.clear();
  }
  public forEach(cb: (value: V[], key1: K1, key2: K2) => void) {
    return this.map.forEach(cb);
  }
}
