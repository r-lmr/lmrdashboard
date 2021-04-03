import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('top_words', function (table) {
    table.string('word', 512).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('top_words', function (table) {
    table.string('word', 255).alter();
  });
}
