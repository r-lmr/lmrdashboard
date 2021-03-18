import mockDb from 'mock-knex';
import last_messages from './resources/mock_db_data/last_messages.json';
import { DatabaseMessageUtils } from '../database/Messages';
import { Sender } from '../Sender';
import knex from '../database/dbConn';
import sw from 'stopword';
import stopwordsEn from 'stopwords-en';

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
    // Stop words are removed
    expected.set('linux', 3);
    expected.set('windows', 1);
    expected.set('bad', 1);
    expected.set('love', 1);

    expect(sortedWordCounts).toEqual(expected);
  });

  test('sw removeStopWords filters out some stop words', async () => {
    // sw's stopword list is not exhaustive
    const textWithStopWords = 'im is a text with stopwords its it is don\'t be not no yes so this or that'.split(/\s+/);
    const customStopwords = ['don\'t']
    const textWithoutStopWords = sw.removeStopwords(textWithStopWords, [...sw.en, ...customStopwords]);
    const expected = ['im', 'text', 'stopwords', 'its', 'not', 'no', 'yes', 'so']
    expect(textWithoutStopWords).toEqual(expected);
  });

  test('sw removeStopWords with an additional stopwords source filters out all stop words', async () => {
    const textWithStopWords = 'im is a text with stopwords its it is don\'t be not no yes so this or that'.split(/\s+/);
    const textWithoutStopWords = sw.removeStopwords(textWithStopWords, [...sw.en, ...stopwordsEn]);
    const expected = ['stopwords']
    expect(textWithoutStopWords).toEqual(expected);
  });
});
