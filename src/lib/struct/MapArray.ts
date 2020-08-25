export class MapArray<K, V> {
  private map: Map<K, V[]> = new Map();
  constructor() {}
  public push(key: K, value: V) {
    const array = this.map.get(key);
    if (array !== undefined) {
      array.push(value);
    } else {
      this.map.set(key, [value]);
    }
  }
  public keys() {
    return this.map.keys();
  }
  public list(key: K) {
    return this.map.get(key);
  }
  public clear() {
    return this.map.clear();
  }
  public forEach(cb: (value: V[], key: K) => void) {
    return this.map.forEach(cb);
  }
}
