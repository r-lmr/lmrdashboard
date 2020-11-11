import Express from 'express';
import cors from 'cors';
import './ircconnection/app';
import myEmitter from './ircconnection/utils/emitter';
import { getUsers, deleteUser, addUser, flushUserTable } from './ircconnection/utils/db/Users';
import { getLines, getLineCountLastNDays, saveLine, getLinesLastNDays, IMessage } from './ircconnection/utils/db/Messages';
import { Response } from 'express-serve-static-core';

const app = Express();
app.use(cors());

// Need a static response object which is overwritten for a new frontend connection
// Otherwise multiple events handlers are added, if the same res is reused
let globalRes: Response<any, number>;

app.get('/test', async (req, res: Response<any, number>) => {
  globalRes = res;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',

    // enabling CORS
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  });

  // Send initial data
  await sendUsers(res);
  await sendMessages(res);
  await sendLineCounts(res);
  await sendTopWords(res);
});

// Send additional data when new data arrives from the irc connection
myEmitter.on('join', async (server: string, nick: string) => {
  await addUser(nick, server);
  await sendUsers(globalRes);
});

myEmitter.on('part', async (server: string, nick: string) => {
  await deleteUser(nick, server);
  await sendUsers(globalRes);
});

myEmitter.on('line', async (nick: string, server: string, msg: string) => {
  console.log(nick, msg);
  await saveLine(nick, server, msg);
  await sendMessages(globalRes);
  await sendLineCounts(globalRes);
});

async function sendUsers(res: Response<any, number>) {
  if (res) {
    const users = await getUsers(process.env.IRC_CHANNEL || '#linuxmasterrace');
    res.write('event: users\n');
    res.write(`data: ${JSON.stringify({ users: users })}`);
    res.write('\n\n');
  }
}

async function sendMessages(res: Response<any, number>) {
  if (res) {
    const messages = await getLines(process.env.IRC_CHANNEL || '#linuxmasterrace', 5);
    res.write('event: messages\n');
    res.write(`data: ${JSON.stringify({ messages: messages })}`);
    res.write('\n\n');
  }
}

async function sendLineCounts(res: Response<any, number>) {
  if (res) {
    const lineCounts = await getLineCountLastNDays(5);
    res.write('event: lineCounts\n');
    res.write(`data: ${JSON.stringify({ lineCounts: lineCounts })}`);
    res.write('\n\n');
  }
}

async function sendTopWords(res: Response<any, number>) {
  // TODO: This actually counts top messages
  // Need to split up the messages into words as well
  if (res) {
    console.log("sendTopWords");
    
    const messages: IMessage[] = await getLinesLastNDays(7);
    const messageTextCounts: Map<string, number> = new Map<string, number>();

    for (const message of messages) {
      const messageText: string = message.message;

      if (!messageTextCounts.has(messageText))
        messageTextCounts.set(messageText, 1);
      else
        messageTextCounts.set(messageText, messageTextCounts.get(messageText)! + 1);
    }

    const sortedMessageTextCounts: Map<string, number> = new
      Map([...messageTextCounts.entries()].sort((a, b) => b[1] - a[1]));

    res.write('event: topWords\n');
    res.write(`data: ${JSON.stringify({ topWords: Array.from(sortedMessageTextCounts.entries()).slice(0, 10) }) }`);
    res.write('\n\n');
  }
}

flushUserTable(process.env.IRC_CHANNEL || '#linuxmasterrace');
app.listen(4000, () => {
  console.log('listening on 4000');
});
