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
