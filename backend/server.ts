import Express from 'express';
import cors from 'cors';
import './irc/ircconnection';
import { addUser, deleteUser, flushUserTable } from './irc/utils/db/Users';
import { Response } from 'express-serve-static-core';
import myEmitter from './irc/utils/emitter';
import { Sender } from './Sender';
import { saveLine } from './irc/utils/db/Messages';

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
  await Sender.sendUsers(res);
  await Sender.sendMessages(res);
  await Sender.sendLineCounts(res);
  await Sender.sendTopWords(res);

  // Daily
  setInterval(async (_) => {
    await Sender.sendTopWords(res);
  }, 24 * 60 * 60 * 1000);

});

// Send additional data when new data arrives from the irc connection
// TODO: If possible move these to a file/class/namespace as well
myEmitter.on('join', async (server: string, nick: string) => {
  await addUser(nick, server);
  await Sender.sendUsers(globalRes);
});

myEmitter.on('part', async (server: string, nick: string) => {
  await deleteUser(nick, server);
  await Sender.sendUsers(globalRes);
});

myEmitter.on('line', async (nick: string, server: string, msg: string) => {
  console.log(nick, msg);
  await saveLine(nick, server, msg);
  await Sender.sendMessages(globalRes);
  await Sender.sendLineCounts(globalRes);
});

flushUserTable(process.env.IRC_CHANNEL || '#linuxmasterrace');
app.listen(4000, () => {
  console.log('listening on 4000');
});
