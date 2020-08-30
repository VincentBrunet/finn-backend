import { Branded } from './../struct/Branded';
import { TickerId } from './Ticker';

export type MetaId = Branded<number, 'MetaId'>;
export type MetaParam = Branded<string, 'MetaParam'>;
export interface Meta extends MetaShell {
  id: MetaId;
}
export interface MetaShell {
  ticker_id: TickerId;
  name: MetaName;
  param: MetaParam;
  content: any;
}

export enum MetaName {
  Unknown = 'unknown',
  Logo = 'logo',
  Description = 'description',
  Sector = 'sector',
  Industry = 'industry',
  Address = 'address',
  Website = 'website',
  Category = 'category',
  Officer = 'officer',
  Exchange = 'exchange',
  Employees = 'employees',
}
