import dotenv from 'dotenv';
dotenv.config();
import Knex from 'knex';
import KnexConn from '../knexfile';

const knex = Knex(KnexConn.production);

export default knex;
