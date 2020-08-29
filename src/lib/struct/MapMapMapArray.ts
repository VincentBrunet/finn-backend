import { MapMapMap } from './MapMapMap';

export class MapMapMapArray<K1, K2, K3, V> {
  private map: MapMapMap<K1, K2, K3, V[]> = new MapMapMap();
  constructor() {}
  public push(key1: K1, key2: K2, key3: K3, value: V) {
    const array = this.map.get(key1, key2, key3);
    if (array !== undefined) {
      array.push(value);
    } else {
      this.map.set(key1, key2, key3, [value]);
    }
  }
  public list(key1: K1, key2: K2, key3: K3) {
    return this.map.get(key1, key2, key3);
  }
  public clear() {
    return this.map.clear();
  }
  public forEach(cb: (value: V[], key1: K1, key2: K2, key3: K3) => void) {
    return this.map.forEach(cb);
  }
}
