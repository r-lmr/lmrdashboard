import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('fight_scores', function(table) {
    table.string('user').unique();
    table.integer('wins');
    table.integer('losses');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('fight_scores');
}
