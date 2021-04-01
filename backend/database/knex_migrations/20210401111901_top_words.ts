import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('top_words', function (table) {
    table.string('word').unique();
    table.integer('count');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('top_words');
}
