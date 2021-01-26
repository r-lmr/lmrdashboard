import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('line_counts', function (table) {
    table.integer('botLines').defaultTo(0);
    table.dateTime('date').defaultTo(knex.raw('utc_timestamp')).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('line_counts', function (table) {
    table.dropColumn('botLines');
    table.dateTime('date').defaultTo(knex.fn.now()).alter();
  });
}
