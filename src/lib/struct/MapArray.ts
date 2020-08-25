export class MapArray<K, V> {
  private map: Map<K, V[]> = new Map();
  constructor() {}
  public add(key: K, value: V) {
    const array = this.map.get(key);
    if (array !== undefined) {
      array.push(value);
    } else {
      this.map.set(key, [value]);
    }
  }
  public list(key: K) {
    return this.map.get(key);
  }
  public clear() {
    this.map.clear();
  }
}
