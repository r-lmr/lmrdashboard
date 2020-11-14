import Express from 'express';
import cors from 'cors';
import './irc/ircconnection';
import { Response } from 'express-serve-static-core';
import myEmitter from './irc/utils/emitter';
import { Sender } from './Sender';
import { DatabaseUserUtils } from './irc/utils/db/Users';
import { ResCollection } from './ResCollection';
import { v4 as uuidv4 } from 'uuid';

const app = Express();
app.use(cors());

const resCollection = ResCollection.Instance;

app.get('/test', async (req, res: Response<any, number>) => {
  const resId = uuidv4();
  resCollection.addToCollection(resId, res);

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

  req.on('close', () => {
    console.log("connection CLOSED");
    resCollection.removeFromCollection(resId);
  });
});

setInterval(() => {
  console.log('Size of resCollection', resCollection.getCollection().size)
}, 10000)

// Send additional data when new data arrives from the irc connection
// TODO: If possible move these to a file/class/namespace as well
myEmitter.on('join', async (server: string, nick: string) => {
  resCollection.doForAllResInCollection(Sender.sendUsers);
});

myEmitter.on('part', async (server: string, nick: string) => {
  resCollection.doForAllResInCollection(Sender.sendUsers);
});

myEmitter.on('line', async (nick: string, server: string, msg: string) => {
  console.log('server.ts myEmitter.on line', nick, msg);
  resCollection.doMultipleForAllResInCollection([
    Sender.sendMessages,
    Sender.sendLineCounts
  ]);
});

DatabaseUserUtils.flushUserTable(process.env.IRC_CHANNEL || '#linuxmasterrace');
app.listen(4000, () => {
  console.log('listening on 4000');
});
