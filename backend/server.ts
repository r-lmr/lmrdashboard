import Express from 'express';
import cors from 'cors';
import './ircconnection/app';
import myEmitter from './ircconnection/utils/emitter';
import { getUsers, deleteUser, addUser, flushUserTable } from './ircconnection/utils/db/Users';
import { getLines, getLineCountLastNDays, saveLine } from './ircconnection/utils/db/Messages';
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

flushUserTable(process.env.IRC_CHANNEL || '#linuxmasterrace');
app.listen(4000, () => {
  console.log('listening on 4000');
});
