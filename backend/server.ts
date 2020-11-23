import Express from 'express';
import cors from 'cors';
import './irc/ircconnection';
import { Response } from 'express-serve-static-core';
import { Sender } from './Sender';
import { InitDatabase } from './irc/utils/db/InitDatabase';
import { DatabaseUserUtils } from './irc/utils/db/Users';
import { ResCollection } from './ResCollection';
import { v4 as uuidv4 } from 'uuid';
import { Listener } from './Listener';

const app = Express();
app.use(cors());
InitDatabase.CreateTablesIfNotExists();

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
  await Sender.sendDuccScores(res);

  // Daily
  setInterval(async () => {
    await Sender.sendTopWords(res);
  }, 24 * 60 * 60 * 1000);

  req.on('close', () => {
    console.log('connection CLOSED');
    resCollection.removeFromCollection(resId);
  });
});

// Send additional data when new data arrives from the irc connection
Listener.addIrcListeners();

// Debug output, can be removed
setInterval(() => {
  console.log('Size of resCollection', resCollection.getCollectionSize());
}, 10000);

DatabaseUserUtils.flushUserTable(process.env.LMRD_IRC_CHANNEL || '#linuxmasterrace');

app.listen(4000, () => {
  console.log('listening on 4000');
});
