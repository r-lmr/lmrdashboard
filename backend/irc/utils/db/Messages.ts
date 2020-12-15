import dotenv from 'dotenv';
dotenv.config();
import knex from './dbConn';

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

  static async getLines(server: string, numOfLines: number) {
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
      };
    });
    return parsedLineCount[0];
  }

  static async saveLine(nick: string, server: string, message: string) {
    await knex('last_messages').insert({ user: nick, server, message });
    const lineCountExists = await knex('line_counts').select().whereRaw('date = date(?)', [new Date()]);
    if (lineCountExists.length < 1) {
      await knex('line_counts').insert({ count: 1, date: this.formatDate(new Date()) });
    } else {
      await knex('line_counts').whereRaw('date = date(?)', [new Date()]).increment('count', 1);
    }
    console.log('Saving message to db.');
  }
}

export { DatabaseMessageUtils };

interface ILineCount {
  date: string;
  lineCount: number;
}

export interface IMessage {
  nick: string;
  server: string;
  message: string;
  dateCreated: string;
}
