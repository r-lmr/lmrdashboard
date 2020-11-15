import Knex from 'knex';

const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.LMRD_DB_HOST || '127.0.0.1',
    port: Number(process.env.LMRD_DB_PORT) || 3306,
    user: process.env.LMRD_DB_USER,
    password: process.env.LMRD_DB_PASS,
    database: process.env.LMRD_DB_NAME,
  },
});

export default knex;
