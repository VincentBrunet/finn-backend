export class MapMap<K1, K2, V> {
  private map1: Map<K1, Map<K2, V>> = new Map();
  constructor() {}
  public set(key1: K1, key2: K2, value: V) {
    const map1 = this.map1.get(key1);
    if (map1 !== undefined) {
      map1.set(key2, value);
    } else {
      const map2 = new Map<K2, V>();
      map2.set(key2, value);
      this.map1.set(key1, map2);
    }
  }
  public map(key1: K1) {
    return this.map1.get(key1);
  }
  public get(key1: K1, key2: K2) {
    return this.map1.get(key1)?.get(key2);
  }
  public clear() {
    this.map1.clear();
  }
}
