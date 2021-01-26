import mockDb from 'mock-knex';
import last_messages from './resources/mock_db_data/last_messages.json';
import { DatabaseMessageUtils } from '../database/Messages';
import { Sender } from '../Sender';
import knex from '../database/dbConn';
const tracker = require('mock-knex').getTracker();

let LAST_MESSAGES: { user: string; server: string; message: string; dateCreated: Date | string }[] = [];

describe('test Sender with mocked database response', () => {
  beforeAll((done) => {
    LAST_MESSAGES = last_messages;
    LAST_MESSAGES.forEach((lm, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - idx);
      lm.dateCreated = date;
    });
    mockDb.mock(knex);
    done();
  });

  afterAll((done) => {
    mockDb.unmock(knex);
    done();
  });

  beforeEach((done) => {
    tracker.install();
    done();
  });

  afterEach((done) => {
    tracker.uninstall();
    done();
  });

  test('getLinesLastNDays returns the correct mock data', async () => {
    tracker.on('query', (query: { response: (arg0: any) => void }) => {
      query.response(LAST_MESSAGES);
    });

    const messages = await DatabaseMessageUtils.getLinesLastNDays(0);
    expect(messages.length).toEqual(LAST_MESSAGES.length);
  }, 5000);

  test('getTopWords calculates the correct word count map', async () => {
    tracker.on('query', (query: { response: (arg0: any) => void }) => {
      query.response(LAST_MESSAGES);
    });

    const sortedWordCounts = await Sender.getTopWords();
    const expected: Map<string, number> = new Map();
    expected.set('linux', 3);
    expected.set('good', 2);
    expected.set('windows', 1);
    expected.set('bad', 1);
    expected.set('dont', 1);
    expected.set('need', 1);
    expected.set('it', 1);
    expected.set('thanks', 1);
    expected.set('im', 1);
    expected.set('best', 1);
    expected.set('love', 1);

    expect(sortedWordCounts).toEqual(expected);
  });
});
