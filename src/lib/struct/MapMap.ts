export class MapMap<K1, K2, V> {
  private map: Map<K1, Map<K2, V>> = new Map();
  constructor() {}
  public set(key1: K1, key2: K2, value: V) {
    const map = this.map.get(key1);
    if (map !== undefined) {
      map.set(key2, value);
    } else {
      const made = new Map();
      made.set(key2, value);
      this.map.set(key1, made);
    }
  }
  public get(key1: K1, key2: K2) {
    return this.map.get(key1)?.get(key2);
  }
  public clear() {
    this.map.clear();
  }
}
