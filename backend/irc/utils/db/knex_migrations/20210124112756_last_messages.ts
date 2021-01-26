import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('last_messages', function (table) {
    table.boolean('userIsBot').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('last_messages', function (table) {
    table.dropColumn('userIsBot');
  });
}
