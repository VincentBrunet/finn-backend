import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('unit', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.string('code', 31).notNullable();

      table.string('symbol', 31);
      table.string('name', 255);

      table.unique(['code']);
    })
    .createTable('exchange', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.integer('unit_id').unsigned().references('id').inTable('unit').notNullable();

      table.string('code', 31).notNullable();

      table.string('name', 512).notNullable();
      table.string('country', 31).notNullable();

      table.unique(['code']);
    })
    .createTable('ticker', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.integer('exchange_id').unsigned().references('id').inTable('exchange').notNullable();
      table.integer('unit_id').unsigned().references('id').inTable('unit').notNullable();

      table.string('code', 31).notNullable();
      table.string('type', 31).notNullable();
      table.string('name', 512).notNullable();
      table.string('platform', 31).notNullable();

      table.unique(['code']);
    })
    .createTable('meta', (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary().notNullable();

      table.integer('ticker_id').unsigned().references('id').inTable('ticker').notNullable();

      table.string('name', 63).notNullable();
      table.string('param', 63).notNullable();
      table.jsonb('content').notNullable();

      table.unique(['ticker_id', 'name', 'param']);
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
      table.integer('unit_id').unsigned().references('id').inTable('unit').notNullable();

      table.specificType('stamp', 'double precision').notNullable();
      table.specificType('value', 'double precision').notNullable();

      table.unique(['ticker_id', 'metric_id', 'stamp']);
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('value')
    .dropTableIfExists('metric')
    .dropTableIfExists('meta')
    .dropTableIfExists('ticker')
    .dropTableIfExists('exchange')
    .dropTableIfExists('unit');
}
