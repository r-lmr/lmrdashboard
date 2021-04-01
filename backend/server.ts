import Express from 'express';
import cors from 'cors';
import './irc/ircconnection';
import { Response } from 'express-serve-static-core';
import { Sender } from './Sender';
import { InitDatabase } from './database/InitDatabase';
import { DatabaseUserUtils } from './database/Users';
import { ResCollection } from './ResCollection';
import { v4 as uuidv4 } from 'uuid';
import { Listener } from './Listener';
import { LogWrapper } from './utils/logging/LogWrapper';

const log = new LogWrapper('server.ts');

const app = Express();
app.use(cors());

const resCollection = ResCollection.Instance;

app.get('/healthz', async (req, res, next) => {
  log.info('Got request for /healthz endoint');
  log.debug('From', {ip: req.ip});
  ['/health', '/healthz'].indexOf(req.path.toLowerCase()) >= 0 && ['get', 'head'].indexOf(req.method.toLowerCase()) >= 0
    ? res.status(200).end()
    : next();
});

app.get('/test', async (req, res: Response<any, number>) => {
  log.info('Got request for /test endoint');
  log.debug('From', {ip: req.ip})
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
  await Sender.sendLineCountsLastDays(res);
  await Sender.sendLineCountsHighScores(res);
  // await Sender.sendTopWords(res);
  await Sender.sendDuccScores(res);

  // Daily
  setInterval(async () => {
    await Sender.sendTopWords(res);
  }, 24 * 60 * 60 * 1000);

  req.on('close', () => {
    log.info('connection CLOSED');
    log.debug('Request IP', {ip: req.ip})
    resCollection.removeFromCollection(resId);
  });
});

// Send additional data when new data arrives from the irc connection
Listener.addIrcListeners();

app.listen(4000, () => {
  log.info('listening on 4000');
  InitDatabase.MigrateDatabase();
  DatabaseUserUtils.flushUserTable();
});
