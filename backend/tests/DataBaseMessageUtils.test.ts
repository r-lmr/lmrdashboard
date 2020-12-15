import knex from 'knex';
import mockDb from 'mock-knex';
import { DatabaseMessageUtils } from '../irc/utils/db/Messages';
const db = knex({
  client: 'mysql',
});

mockDb.mock(db);

const MOCKED_DATA = [
  {
    user: 'foo',
    server: 'bar',
    message: 'foobar',
    dateCreated: new Date()
  },
  {
    user: 'asdf',
    server: 'fdsa',
    message: 'qwer',
    dateCreated: new Date()
  }
]

const tracker = require('mock-knex').getTracker();
tracker.install();
tracker.on('query', (query: { response: (arg0: any) => void; }) => {
  query.response(MOCKED_DATA);
});

describe('foo', () => {
  it('bar', async () => {
    const res = await DatabaseMessageUtils.getLinesLastNDays(1);
    const users = res;
    console.log(users);
  });
});
