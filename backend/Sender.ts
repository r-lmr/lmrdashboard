import { Response } from 'express-serve-static-core';
import sw from 'stopword';
import { getLines, getLineCountLastNDays, IMessage, getLinesLastNDays } from './irc/utils/db/Messages';
import { getUsers } from './irc/utils/db/Users';

class Sender {
  static async sendUsers(res: Response<any, number>) {
    if (res) {
      const users = await getUsers(process.env.IRC_CHANNEL || '#linuxmasterrace');
      res.write('event: users\n');
      res.write(`data: ${JSON.stringify({ users: users })}`);
      res.write('\n\n');
    }
  }

  static async sendMessages(res: Response<any, number>) {
    if (res) {
      const messages = await getLines(process.env.IRC_CHANNEL || '#linuxmasterrace', 5);
      res.write('event: messages\n');
      res.write(`data: ${JSON.stringify({ messages: messages })}`);
      res.write('\n\n');
    }
  }

  static async sendLineCounts(res: Response<any, number>) {
    if (res) {
      const lineCounts = await getLineCountLastNDays(5);
      res.write('event: lineCounts\n');
      res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
      res.write('\n\n');
    }
  }

  static async sendTopWords(res: Response<any, number>) {
    if (res) {
      console.log(`sendTopWords at ${new Date()}`);

      const messages: IMessage[] = await getLinesLastNDays(7);
      const wordCounts: Map<string, number> = new Map<string, number>();

      for (const message of messages) {
        const messageText: string = message.message.toLowerCase();
        const words = sw.removeStopwords(messageText.split(/\s+/));
        for (const word of words) {
          if (!wordCounts.has(word)) wordCounts.set(word, 1);
          else wordCounts.set(word, wordCounts.get(word)! + 1);
        }
      }

      const sortedWordCounts: Map<string, number> = new Map([...wordCounts.entries()].sort((a, b) => b[1] - a[1]));

      res.write('event: topWords\n');
      res.write(`data: ${JSON.stringify({ topWords: Array.from(sortedWordCounts.entries()).slice(0, 10) })}`);
      res.write('\n\n');
    }
  }
}

export { Sender };
