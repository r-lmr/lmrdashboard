import myEmitter from './irc/utils/emitter';
import { ResCollection } from './ResCollection';
import { Sender } from './Sender';
import { LogWrapper } from './utils/logging/LogWrapper';

const log = new LogWrapper(module.id);

class Listener {
  static addIrcListeners(): void {
    const resCollection = ResCollection.Instance;

    myEmitter.on('join', async () => {
      log.debug('Received join from emitter, sending users');
      resCollection.doForAllResInCollection(Sender.sendUsers);
    });
    myEmitter.on('part', async () => {
      log.debug('Received part from emitter, sending users');
      resCollection.doForAllResInCollection(Sender.sendUsers);
    });
    myEmitter.on('line', async () => {
      log.debug('Received line from emitter, sending messages, line counts, line count scores');
      resCollection.doMultipleForAllResInCollection([
        Sender.sendMessages,
        Sender.sendLineCountsLastDays,
        Sender.sendLineCountsHighScores,
      ]);
    });
    myEmitter.on('friendScore', async () => {
      log.debug('Received friendScore from emitter, sending ducc scores');
      resCollection.doForAllResInCollection(Sender.sendDuccScores);
    });
    myEmitter.on('killedScore', async () => {
      log.debug('Received killedScore from emitter, sending ducc scores');
      resCollection.doForAllResInCollection(Sender.sendDuccScores);
    });
    myEmitter.on('fightScore', async () => {
      log.debug('Received fightScore from emitter, sending fight scores');
      resCollection.doForAllResInCollection(Sender.sendFightScores);
    });
  }
}

export { Listener };
