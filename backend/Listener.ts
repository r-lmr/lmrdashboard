import myEmitter from './irc/utils/emitter';
import { ResCollection } from './ResCollection';
import { Sender } from './Sender';

class Listener {

  static addIrcListeners() {
    const resCollection = ResCollection.Instance;

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
  }

}

export { Listener };