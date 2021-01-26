import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('line_counts', function (table) {
    table.integer('botLines').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('line_counts', function (table) {
    table.dropColumn('botLines');
  });
}
