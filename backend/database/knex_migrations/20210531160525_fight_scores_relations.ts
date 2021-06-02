import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('fight_scores_relations', function(table) {
    table.string('winner');
    table.string('loser');
    table.integer('times');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('fight_scores_relations');
}
