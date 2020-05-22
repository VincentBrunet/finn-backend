import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('value', (table: Knex.CreateTableBuilder) => {
    table.index('ticker_id');
    table.index('metric_id');
    table.index('stamp');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('value', (table: Knex.CreateTableBuilder) => {
    table.dropIndex('ticker_id');
    table.dropIndex('metric_id');
    table.dropIndex('stamp');
  });
}
