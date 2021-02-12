import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('friend_scores', function (table) {
    table.string('user').unique();
    table.integer('duccs');
  });
  knex.schema.createTable('killer_scores', function (table) {
    table.string('user').unique();
    table.integer('duccs');
  });
  knex.schema.createTable('last_messages', function (table) {
    table.string('user');
    table.string('server');
    table.string('message', 512);
    table.dateTime('dateCreated').defaultTo(knex.fn.now());
    table.boolean('userIsBot');
  });
  knex.schema.createTable('line_counts', function (table) {
    table.integer('count');
    table.integer('botLines');
    table.dateTime('date');
  });
  knex.schema.createTable('online_users', function (table) {
    table.string('user').unique();
    table.string('role');
    table.dateTime('dateCreated').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('friend_scroes');
  knex.schema.dropTable('killer_scroes');
  knex.schema.dropTable('last_messages');
  knex.schema.dropTable('line_counts');
  knex.schema.dropTable('online_users');
}
