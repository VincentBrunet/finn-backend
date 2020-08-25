export class MapMapMap<K1, K2, K3, V> {
  private map1: Map<K1, Map<K2, Map<K3, V>>> = new Map();
  constructor() {}
  public set(key1: K1, key2: K2, key3: K3, value: V) {
    const map2 = this.map1.get(key1);
    if (map2 !== undefined) {
      const map3 = map2.get(key2);
      if (map3 !== undefined) {
        map3.set(key3, value);
      } else {
        const map3 = new Map();
        map3.set(key3, value);
        map2.set(key2, map3);
      }
    } else {
      const map2 = new Map<K2, Map<K3, V>>();
      const map3 = new Map<K3, V>();
      map3.set(key3, value);
      map2.set(key2, map3);
      this.map1.set(key1, map2);
    }
  }
  public get(key1: K1, key2: K2, key3: K3) {
    return this.map1.get(key1)?.get(key2)?.get(key3);
  }
  public clear() {
    this.map1.clear();
  }
}
