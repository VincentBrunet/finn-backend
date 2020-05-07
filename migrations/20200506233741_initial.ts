import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('ticker', (table: Knex.CreateTableBuilder) => {
      table.increments('id').notNullable();

      table.string('symbol', 31).notNullable();
      table.string('name', 255).notNullable();
      table.string('exchange', 255).notNullable();

      table.unique(['symbol']);
      table.index(['id']);
    })
    .createTable('metric', (table: Knex.CreateTableBuilder) => {
      table.increments('id').notNullable();

      table.string('name', 255).notNullable();
      table.string('category', 255).notNullable();

      table.unique(['name', 'category']);
      table.index(['id']);
    })
    .createTable('value', (table: Knex.CreateTableBuilder) => {
      table.increments('id').notNullable();

      table.integer('ticker_id').unsigned().notNullable();
      table.integer('metric_id').unsigned().notNullable();

      table.dateTime('moment').notNullable();
      table.float('value').notNullable();

      table.foreign('ticker_id').references('id').inTable('ticker');
      table.foreign('metric_id').references('id').inTable('metric');

      table.unique(['ticker_id', 'metric_id', 'moment']);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('value')
    .dropTableIfExists('metric')
    .dropTableIfExists('ticker');
}
