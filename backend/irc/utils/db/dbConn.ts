import Knex from 'knex';

const knex = Knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
  },
});

export default knex;
