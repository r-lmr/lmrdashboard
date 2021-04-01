import { Response } from 'express-serve-static-core';
import sw from 'stopword';
import stopwordsEn from 'stopwords-en';
import { DatabaseMessageUtils, IMessage } from './database/Messages';
import { DatabaseUserUtils } from './database/Users';
import { DatabaseDuccUtils } from './database/DuccScores';
import { LogWrapper } from './utils/logging/LogWrapper';

const log = new LogWrapper(module.id);

class Sender {
  static async sendUsers(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending users to', { ip: res.req?.ip });
      const users = await DatabaseUserUtils.getUsers();

      // Sort users according to rank, within alphabetically
      const sortedUsers = DatabaseUserUtils.getSortedUsersByRoleAndAlphabetically(users);

      res.write('event: users\n');
      res.write(`data: ${JSON.stringify({ users: sortedUsers })}`);
      res.write('\n\n');
    }
  }

  static async sendMessages(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending messages to', { ip: res.req?.ip });
      const messages = await DatabaseMessageUtils.getLines(process.env.LMRD_IRC_CHANNEL || '#linuxmasterrace', 15);
      res.write('event: messages\n');
      res.write(`data: ${JSON.stringify({ messages: messages })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCountsLastDays(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending line counts to', { ip: res.req?.ip });
      const lineCounts = await DatabaseMessageUtils.getLineCountLastNDaysOrMax(5, 'date');
      res.write('event: lineCountsLastDays\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCountsHighScores(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending line count scores to', { ip: res.req?.ip });
      const lineCounts = await DatabaseMessageUtils.getLineCountLastNDaysOrMax(5, 'count');
      res.write('event: lineCountsHighScores\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async getTopWords(): Promise<void> {
    const messages: IMessage[] = await DatabaseMessageUtils.getLinesLastNDays(7);
    const wordCounts: Map<string, number> = new Map<string, number>();

    for (const message of messages) {
      const messageText: string = message.message.toLowerCase();

      const splitAndCleanedWords: string[] = messageText
        .split(/\s+/)
        .map((word: string) => word.replace(/[^a-zA-Z0-9 ]/g, '').trim());

      // More stop word sources are necessary to filter out all
      const words = sw.removeStopwords(splitAndCleanedWords, [...sw.en, ...stopwordsEn]);

      for (const word of words) {
        if (word && !word.match(/^[0-9]*$/)) {
          if (!wordCounts.has(word)) wordCounts.set(word, 1);
          else wordCounts.set(word, wordCounts.get(word)! + 1);
        }
      }
    }

    const sortedWordCounts: Map<string, number> = new Map([...wordCounts.entries()].sort((a, b) => b[1] - a[1]));
    await DatabaseMessageUtils.insertTopWords(sortedWordCounts);
  }

  static async sendTopWords(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending top words to', { ip: res.req?.ip });
      const sortedWordCounts = await DatabaseMessageUtils.getTopWords();
      res.write('event: topWords\n');
      res.write(`data: ${JSON.stringify({ topWords: sortedWordCounts })}`);
      res.write('\n\n');
    }
  }
  static async sendDuccScores(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending ducc scores to', { ip: res.req?.ip });
      const duccScores = await DatabaseDuccUtils.retrieveAllDuccScores();
      res.write('event: duccScore\n');
      res.write(`data: ${JSON.stringify({ duccScores })}`);
      res.write('\n\n');
    }
  }
}

// every hour we do the top words calculation
setInterval(() => {
  log.info('Running top words calculation and inserting into DB');
  Sender.getTopWords();
}, 1000 * 60 * 60);

export { Sender };
