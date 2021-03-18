import { Response } from 'express-serve-static-core';
import sw from 'stopword';
import stopwordsEn from 'stopwords-en';
import { DatabaseMessageUtils, IMessage } from './database/Messages';
import { DatabaseUserUtils } from './database/Users';
import { DatabaseDuccUtils } from './database/DuccScores';

class Sender {
  static async sendUsers(res: Response<any, number>): Promise<void> {
    if (res) {
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
      const messages = await DatabaseMessageUtils.getLines(process.env.LMRD_IRC_CHANNEL || '#linuxmasterrace', 15);
      res.write('event: messages\n');
      res.write(`data: ${JSON.stringify({ messages: messages })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCountsLastDays(res: Response<any, number>): Promise<void> {
    if (res) {
      const lineCounts = await DatabaseMessageUtils.getLineCountLastNDaysOrMax(5, 'date');
      res.write('event: lineCountsLastDays\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCountsHighScores(res: Response<any, number>): Promise<void> {
    if (res) {
      const lineCounts = await DatabaseMessageUtils.getLineCountLastNDaysOrMax(5, 'count');
      res.write('event: lineCountsHighScores\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async getTopWords(): Promise<Map<string, number>> {
    const messages: IMessage[] = await DatabaseMessageUtils.getLinesLastNDays(7);
    const wordCounts: Map<string, number> = new Map<string, number>();

    for (const message of messages) {
      const messageText: string = message.message.toLowerCase();

      const splitAndCleanedWords: string[] = messageText.split(/\s+/)
        .map((word: string) =>
          word.replace(/[^a-zA-Z0-9 ]/g, '').trim()
        );

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
    return sortedWordCounts;
  }

  static async sendTopWords(res: Response<any, number>): Promise<void> {
    if (res) {
      console.log(`sendTopWords at ${new Date()}`);
      const sortedWordCounts = await this.getTopWords();
      res.write('event: topWords\n');
      res.write(`data: ${JSON.stringify({ topWords: Array.from(sortedWordCounts.entries()).slice(0, 20) })}`);
      res.write('\n\n');
    }
  }
  static async sendDuccScores(res: Response<any, number>): Promise<void> {
    if (res) {
      const duccScores = await DatabaseDuccUtils.retrieveAllDuccScores();
      res.write('event: duccScore\n');
      res.write(`data: ${JSON.stringify({ duccScores })}`);
      res.write('\n\n');
    }
  }
}

export { Sender };
