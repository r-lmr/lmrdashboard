import dotenv from "dotenv";
dotenv.config();
import knex from "./dbConn";

export async function getLines(server: string, numOfLines: number) {
  const messages = await knex("last_messages")
    .select()
    .where({ server })
    .orderBy("dateCreated", "desc")
    .limit(numOfLines);
  const parsedMsg = messages.map((entry) => {
    return {
      nick: entry["user"],
      server: entry["server"],
      message: entry["message"],
      dateCreated: entry["dateCreated"],
    };
  });
  return parsedMsg;
}

export async function getLineCountLastNDays(days: number): Promise<ILineCount[]> {
  const lineCount = await knex("line_counts")
    .select()
    .orderBy("date", "desc")
    .limit(days);
  const parsedLineCount = lineCount.map((entry) => {
    return {
      date: entry["date"],
      lineCount: entry["count"],
    };
  });
  return parsedLineCount;
}

async function getLineCount(date: string): Promise<ILineCount> {
  const lineCount = await knex("line_counts")
    .select()
    .where({ date });
  const parsedLineCount = lineCount.map((entry) => {
    return {
      date: entry["date"],
      lineCount: entry["count"],
    };
  });
  return parsedLineCount[0];
}

export async function saveLine(nick: string, server: string, message: string) {
  await knex("last_messages").insert({ user: nick, server, message });
  console.log("Saving message to db.");
}

export default { getLines };

interface ILineCount {
  date: string;
  lineCount: number;
}
