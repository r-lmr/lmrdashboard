import myEmitter from './irc/utils/emitter';
import { ResCollection } from './ResCollection';
import { Sender } from './Sender';

class Listener {
  static addIrcListeners(): void {
    const resCollection = ResCollection.Instance;

    myEmitter.on('join', async () => {
      resCollection.doForAllResInCollection(Sender.sendUsers);
    });
    myEmitter.on('part', async () => {
      resCollection.doForAllResInCollection(Sender.sendUsers);
    });
    myEmitter.on('line', async () => {
      resCollection.doMultipleForAllResInCollection([
        Sender.sendMessages,
        Sender.sendLineCountsLastDays,
        Sender.sendLineCountsHighScores,
      ]);
    });
    myEmitter.on('friendScore', async () => {
      resCollection.doForAllResInCollection(Sender.sendDuccScores);
    });
    myEmitter.on('killedScore', async () => {
      resCollection.doForAllResInCollection(Sender.sendDuccScores);
    });
  }
}

export { Listener };
