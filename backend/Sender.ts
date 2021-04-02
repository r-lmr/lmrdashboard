import { Response } from 'express-serve-static-core';
import { DatabaseMessageUtils } from './database/Messages';
import { DatabaseUserUtils } from './database/Users';
import { DatabaseDuccUtils } from './database/DuccScores';
import { LogWrapper } from './utils/logging/LogWrapper';

const log = new LogWrapper(module.id);

class Sender {
  static async sendUsers(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending users');
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
      log.debug('Sending messages');
      const messages = await DatabaseMessageUtils.getLines(process.env.LMRD_IRC_CHANNEL || '#linuxmasterrace', 15);
      res.write('event: messages\n');
      res.write(`data: ${JSON.stringify({ messages: messages })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCountsLastDays(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending line counts');
      const lineCounts = await DatabaseMessageUtils.getLineCountLastNDaysOrMax(5, 'date');
      res.write('event: lineCountsLastDays\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCountsHighScores(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending line count scores');
      const lineCounts = await DatabaseMessageUtils.getLineCountLastNDaysOrMax(5, 'count');
      res.write('event: lineCountsHighScores\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async sendTopWords(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending top words');
      const sortedWordCounts = await DatabaseMessageUtils.getTopWords();
      res.write('event: topWords\n');
      res.write(`data: ${JSON.stringify({ topWords: sortedWordCounts })}`);
      res.write('\n\n');
    }
  }
  static async sendDuccScores(res: Response<any, number>): Promise<void> {
    if (res) {
      log.debug('Sending ducc scores');
      const duccScores = await DatabaseDuccUtils.retrieveAllDuccScores();
      res.write('event: duccScore\n');
      res.write(`data: ${JSON.stringify({ duccScores })}`);
      res.write('\n\n');
    }
  }
}

export { Sender };
