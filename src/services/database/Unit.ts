import { Connection } from './Connection';

export interface Unit extends UnitShell {
  id: number;
}
export interface UnitShell {
  code: string;
  name?: string;
  symbol?: string;
}

export class Unit {
  /**
   * Base
   */
  private static table = 'unit';
  static async list(): Promise<Unit[]> {
    return await Connection.list<Unit>(Unit.table);
  }
  static async update(value: Unit) {
    await Connection.update<Unit>(Unit.table, value);
  }
  static async insert(value: UnitShell) {
    await Connection.insert<UnitShell>(Unit.table, value);
  }
  static async insertIgnoreFailure(value: UnitShell) {
    await Connection.insertIgnoreFailure<UnitShell>(Unit.table, value);
  }
  /**
   * Utils
   */
  static async mapById() {
    const list = await Unit.list();
    const mapping = new Map<number, Unit>();
    for (const item of list) {
      mapping.set(item.id, item);
    }
    return mapping;
  }
  static async mapByCode() {
    const list = await Unit.list();
    const mapping = new Map<string, Unit>();
    for (const item of list) {
      mapping.set(item.code, item);
    }
    return mapping;
  }
  /**
   * Cached lookup
   */
  private static cacheById: Map<number, Unit>;
  static async lookupById(id: number) {
    if (!Unit.cacheById || !Unit.cacheById.has(id)) {
      Unit.cacheById = await Unit.mapById();
    }
    return Unit.cacheById.get(id);
  }
  private static cacheByCode: Map<string, Unit>;
  static async lookupByCode(code: string) {
    if (!Unit.cacheByCode) {
      Unit.cacheByCode = await Unit.mapByCode();
    }
    if (!Unit.cacheByCode.has(code)) {
      await Unit.insertIgnoreFailure({
        code: code,
      });
      Unit.cacheByCode = await Unit.mapByCode();
    }
    return Unit.cacheByCode.get(code);
  }
}
