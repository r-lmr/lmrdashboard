import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('friend_scores', function (table) {
    table.string('user').unique();
    table.integer('duccs');
  });
  await knex.schema.createTable('killer_scores', function (table) {
    table.string('user').unique();
    table.integer('duccs');
  });
  await knex.schema.createTable('last_messages', function (table) {
    table.string('user');
    table.string('server');
    table.string('message', 512);
    table.dateTime('dateCreated').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('line_counts', function (table) {
    table.integer('count');
    table.dateTime('date');
  });
  await knex.schema.createTable('online_users', function (table) {
    table.string('user').unique();
    table.string('role');
    table.dateTime('dateCreated').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('friend_scores');
  await knex.schema.dropTable('killer_scores');
  await knex.schema.dropTable('last_messages');
  await knex.schema.dropTable('line_counts');
  await knex.schema.dropTable('online_users');
}
