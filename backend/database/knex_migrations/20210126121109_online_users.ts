import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('online_users', function (table) {
    table.dateTime('dateCreated').defaultTo(knex.raw('utc_timestamp')).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('online_users', function (table) {
    table.dateTime('dateCreated').defaultTo(knex.fn.now()).alter();
  });
}
