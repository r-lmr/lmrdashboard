import dotenv from 'dotenv';
import { LogWrapper } from '../utils/logging/LogWrapper';
dotenv.config();
import knex from './dbConn';
import sw from 'stopword';
import stopwordsEn from 'stopwords-en';

const log = new LogWrapper(module.id);

class DatabaseMessageUtils {
  static formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  static async getLines(server: string, numOfLines: number): Promise<IMessage[]> {
    const messages = await knex('last_messages')
      .select()
      .where({ server })
      .orderBy('dateCreated', 'desc')
      .limit(numOfLines);
    const parsedMsg = messages.map((entry) => {
      return {
        nick: entry['user'],
        server: entry['server'],
        message: entry['message'],
        userIsBot: entry['userIsBot'],
        dateCreated: entry['dateCreated'],
      };
    });
    return parsedMsg;
  }

  static async getLinesLastNDays(days: number): Promise<IMessage[]> {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - days);

    const lines = await knex('last_messages').where('dateCreated', '>=', this.formatDate(from)).select();
    const parsedLines = lines.map((entry) => {
      return {
        nick: entry['user'],
        server: entry['server'],
        message: entry['message'],
        userIsBot: entry['userIsBot'],
        dateCreated: entry['dateCreated'],
      };
    });
    return parsedLines;
  }

  static async getLineCountLastNDaysOrMax(days: number, orderColumn: string): Promise<ILineCount[]> {
    const lineCounts = await knex('line_counts').select().orderBy(orderColumn, 'desc').limit(days);
    const parsedLineCounts = lineCounts.map((entry) => {
      return {
        date: this.formatDate(entry['date']),
        lineCount: entry['count'],
        botLines: entry['botLines'],
      };
    });
    return parsedLineCounts;
  }

  static async getLineCount(date: string): Promise<ILineCount> {
    const lineCount = await knex('line_counts').select().where({ date });
    const parsedLineCount = lineCount.map((entry) => {
      return {
        date: entry['date'],
        lineCount: entry['count'],
        botLines: entry['botLines'],
      };
    });
    return parsedLineCount[0];
  }

  static async saveLine(nick: string, server: string, message: string, userIsBot: boolean): Promise<void> {
    await knex('last_messages').insert({ user: nick, server, message, userIsBot });
    const lineCountExists = await knex('line_counts').select().whereRaw('date = date(?)', [new Date()]);

    if (!userIsBot) {
      if (lineCountExists.length < 1) {
        await knex('line_counts').insert({ count: 1, botLines: 0, date: this.formatDate(new Date()) });
      } else {
        await knex('line_counts').whereRaw('date = date(?)', [new Date()]).increment('count', 1);
      }
    } else {
      if (lineCountExists.length < 1) {
        await knex('line_counts').insert({ count: 1, botLines: 1, date: this.formatDate(new Date()) });
      } else {
        await knex('line_counts')
          .whereRaw('date = date(?)', [new Date()])
          .increment('botLines', 1)
          .increment('count', 1);
      }
    }

    log.debug('Saving message to db.', { nick, userIsBot, message });
  }

  static async insertTopWords(wordMap: Map<string, number>): Promise<void> {
    log.debug('Inserting top words into the database');
    wordMap.forEach(async (count, word) => {
      const wordExists = await knex('top_words').select().where({ word });
      if (wordExists.length < 1) {
        await knex('top_words').insert({ count, word });
      } else {
        await knex('top_words').where({ word }).update({ count });
      }
    });
  }

  static async getTopWords(): Promise<ITopWord[]> {
    log.debug('Retrieving top words from the database');
    const topWords = await knex('top_words').select().orderBy('count', 'desc').limit(20);
    const parsedTopWords = topWords.map((entry) => {
      return {
        word: entry['word'],
        count: entry['count'],
      };
    });
    return parsedTopWords;
  }

  static async getTopWordsAndInsertIntoDatabase(): Promise<void> {
    const sortedWordCounts: Map<string, number> = await DatabaseMessageUtils.calculateTopWords();
    await DatabaseMessageUtils.insertTopWords(sortedWordCounts);
  }

  static async calculateTopWords(): Promise<Map<string, number>> {
    log.debug('Calculating top words');

    const nDays = 7;
    const messages: IMessage[] = await DatabaseMessageUtils.getLinesLastNDays(nDays);
    log.debug(`messages in last N=${nDays} days: ${messages.length}`);

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

    // Some debug information
    log.debug(`sortedWordCounts: ${sortedWordCounts.size}`);
    const words: string[] = Array.from(sortedWordCounts.keys());
    const longestWord = words.reduce((acc: string, w: string) => {
      return acc.length > w.length ? acc : w;
    });
    log.debug(`Longest word (length: ${longestWord.length}) in the map: ${longestWord}`);

    return sortedWordCounts;
  }
}

export { DatabaseMessageUtils };

interface ILineCount {
  date: string;
  lineCount: number;
  botLines: number;
}

interface ITopWord {
  word: string;
  count: number;
}

export interface IMessage {
  nick: string;
  server: string;
  message: string;
  dateCreated: string;
  userIsBot: boolean;
}
