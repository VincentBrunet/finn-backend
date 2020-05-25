export class Maps {
  static keys<K, V>(map: Map<K, V>) {
    return [...map.keys()];
  }
  static values<K, V>(map: Map<K, V>) {
    return [...map.values()];
  }
}
