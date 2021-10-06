import cors from 'cors';
import Express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseFightUtils } from './database/Fights';
import { InitDatabase } from './database/InitDatabase';
import { DatabaseMessageUtils } from './database/Messages';
import { DatabaseUserUtils } from './database/Users';
import './irc/ircconnection';
import { Listener } from './Listener';
import { ResCollection } from './ResCollection';
import { Sender } from './Sender';
import { LogWrapper } from './utils/logging/LogWrapper';

const log = new LogWrapper('server.ts');

const app = Express();
app.use(cors());

const resCollection = ResCollection.Instance;

app.get('/healthz', async (req, res, next) => {
  ['/health', '/healthz'].indexOf(req.path.toLowerCase()) >= 0 && ['get', 'head'].indexOf(req.method.toLowerCase()) >= 0
    ? res.status(200).end()
    : next();
});

app.get('/fightRelation', async (req, res) => {
  const {nick1, nick2} = req.query;
  if (typeof nick1 !== 'string' || typeof nick2 !== 'string') {
    res.sendStatus(400);
    return;
  }

  const fightRelation = await DatabaseFightUtils.retrieveFightRelation(nick1, nick2);
  log.debug('Found fightRelation', {fightRelation});
  if (fightRelation == null) {
    res.sendStatus(404);
  } else {
    res.send(fightRelation);
  }
});

app.get('/test', async (req, res) => {
  log.info('Got request for /test endoint');
  const resId = uuidv4();
  log.verbose('New request', { id: resId });
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
  await Sender.sendTopWords(res); // Retrieved from the database
  await Sender.sendDuccScores(res);
  await Sender.sendFightScores(res);

  // Daily we send the top words that are in the database
  setInterval(async () => {
    await Sender.sendTopWords(res);
  }, 24 * 60 * 60 * 1000);

  req.on('close', () => {
    log.info('connection CLOSED');
    log.verbose('Request', { id: resId });
    resCollection.removeFromCollection(resId);
  });
});

// Send additional data when new data arrives from the irc connection
Listener.addIrcListeners();

// Every hour we do the top words calculation
setInterval(() => {
  log.info('Running top words calculation and inserting into DB');
  DatabaseMessageUtils.getTopWordsAndInsertIntoDatabase();
}, 1000 * 60 * 60);

app.listen(4000, () => {
  log.info('listening on 4000');
  InitDatabase.MigrateDatabase();
  DatabaseUserUtils.flushUserTable();
});
