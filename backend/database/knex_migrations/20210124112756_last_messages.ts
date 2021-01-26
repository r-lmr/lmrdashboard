import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('last_messages', function (table) {
    table.boolean('userIsBot').notNullable().defaultTo(0);
    table.dateTime('dateCreated').defaultTo(knex.raw('utc_timestamp')).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('last_messages', function (table) {
    table.dropColumn('userIsBot');
    table.dateTime('dateCreated').defaultTo(knex.fn.now()).alter();
  });
}
