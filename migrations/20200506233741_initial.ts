import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('ticker', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.string('symbol', 31).notNullable();
      table.string('name', 255).notNullable();
      table.string('exchange', 255).notNullable();

      table.unique(['symbol']);
    })
    .createTable('metric', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.string('name', 255).notNullable();
      table.string('category', 255).notNullable();
      table.string('period', 255).notNullable();

      table.unique(['name', 'category', 'period']);
    })
    .createTable('value', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.integer('ticker_id').unsigned().references('id').inTable('ticker').notNullable();
      table.integer('metric_id').unsigned().references('id').inTable('metric').notNullable();

      table.dateTime('stamp').notNullable();
      table.float('value', 14, 10).notNullable();

      table.unique(['ticker_id', 'metric_id', 'stamp']);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('value')
    .dropTableIfExists('metric')
    .dropTableIfExists('ticker');
}
