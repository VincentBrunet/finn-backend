export class Strings {
  static padPostfix(value: string | number, size: number, postfix?: string) {
    let s = value + '';
    while (s.length < size) {
      s = s + (postfix ?? ' ');
    }
    return s;
  }
  static padPrefix(value: string | number, size: number, prefix?: string) {
    let s = value + '';
    while (s.length < size) {
      s = (prefix ?? ' ') + s;
    }
    return s;
  }
  static ellipsis(value: string | number, size: number) {
    let s = value + '';
    if (s.length > size) {
      s = s.slice(0, size - 3) + '...';
    }
    return s;
  }
}
