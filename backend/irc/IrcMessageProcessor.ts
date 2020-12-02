import { TLSSocket } from 'tls';
import { JoinConfig } from './ircconnection';
import { DatabaseDuccUtils } from './utils/db/DuccScores';
import { DatabaseMessageUtils } from './utils/db/Messages';
import { DatabaseUserUtils } from './utils/db/Users';
import myEmitter from './utils/emitter';

/*
 * Singleton that processes incoming IRC messages and relays related operations
 */
class IrcMessageProcessor {
  private static _instance: IrcMessageProcessor;
  private readonly client: TLSSocket;
  private readonly joinConfig: JoinConfig;
  private readonly names: string[];
  private readonly parseCommands: Map<PossibleIrcCommand, (ircMessage: IrcMessage) => void>;

  private constructor(client: TLSSocket, joinConfig: JoinConfig) {
    this.client = client;
    this.joinConfig = joinConfig;
    this.names = [];
    this.parseCommands = new Map<PossibleIrcCommand, (ircMessage: IrcMessage) => void>();
    this.parseCommands.set('PING', this.processPing.bind(this));
    this.parseCommands.set('MODE', this.processMode.bind(this));
    this.parseCommands.set('JOIN', this.processJoin.bind(this));
    this.parseCommands.set('353', this.process353.bind(this));
    this.parseCommands.set('PART', this.processPartAndQuit.bind(this));
    this.parseCommands.set('KICK', this.processKick.bind(this));
    this.parseCommands.set('QUIT', this.processPartAndQuit.bind(this));
    this.parseCommands.set('PRIVMSG', this.processPrivMsg.bind(this));
  }

  public static Instance(client: TLSSocket, joinConfig: JoinConfig) {
    return this._instance || (this._instance = new this(client, joinConfig));
  }

  public processIrcMessage(ircMessage: IrcMessage) {
    if (this.parseCommands.has(ircMessage.command as PossibleIrcCommand))
      this.parseCommands.get(ircMessage.command as PossibleIrcCommand)!(ircMessage);
  }

  public parseMessage(line: string): IrcMessage {
    // for some reason the chunks arent always parsed as lines by \r\n
    // so we force it by splitting our selves then loop over each line
    if (line[0] == ':') {
      const input = line.split(' ');
      const msg = {
        prefix: input[0],
        command: input[1],
        params: input.slice(2),
      };
      console.log(msg);
      return msg;
    } else {
      const input = line.split(' ');
      const msg = { command: input[0], params: [input[1]] };
      return msg;
    }
  }

  private processPing(ircMessage: IrcMessage) {
    this.client.write('PONG ' + ircMessage.params[0] + '\r\n');
  }

  private processMode() {
    this.client.write(`JOIN ${this.joinConfig.channel}\r\n`);
    this.client.write(`NAMES ${this.joinConfig.channel}\r\n`);
    console.log(`TRYING TO JOIN ${this.joinConfig.channel}`);
  }

  private async processJoin(ircMessage: IrcMessage) {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    if (nick != this.joinConfig.user) {
      const server: string = ircMessage.params[0].split(' ', 1)[0].replace(':', '');
      await DatabaseUserUtils.addUser(nick!, this.joinConfig.channel);
      myEmitter.emit('join');
    }
  }

  private async process353(ircMessage: IrcMessage) {
    ircMessage.params.slice(3).forEach(async (name) => {
      name = name.replace(':', '').trim();
      if (name.length > 0 && !this.names.includes(name)) {
        this.names.push(name);
        const server = '#' + ircMessage.params[2].slice(1);
        await DatabaseUserUtils.addUser(name, server);
      }
    });
  }

  private async processPartAndQuit(ircMessage: IrcMessage) {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    await DatabaseUserUtils.deleteUser(nick!, this.joinConfig.channel);
    myEmitter.emit('part');
  }
  
  private async processKick(ircMessage: IrcMessage) {
    const nick = ircMessage.params[1];
    await DatabaseUserUtils.deleteUser(nick!, this.joinConfig.channel);
    myEmitter.emit('part');
  }
  
  private async processPrivMsg(ircMessage: IrcMessage) {
    if (Date.now() - this.joinConfig.bufferTime.getTime() < 5000) return;

    // Normal messages can only hold 256 chars in the database
    const msg = ircMessage.params.slice(1).join(' ').substring(1, 256);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    const server = ircMessage.params[0];
    console.log(nick, msg);
    // Process non bot messages
    if (!ircMessage.prefix?.toLowerCase().split('@')[1].includes('/bot/')) {
      await DatabaseMessageUtils.saveLine(nick!, server, msg);
      myEmitter.emit('line');
    } else {
      // Process bot messages
      // Process ducc stats
      if (msg.match(/Duck \w{6} scores in #/i) && nick === 'gonzobot') {
        const duccMsg = ircMessage.params.slice(1).join(' ');
        const splitMsgByBullet = duccMsg.split('\u2022');
        // fix the first split by removing the 'Duck ... scores in #channel'
        const correctFirstScore = splitMsgByBullet[0].split(':');
        splitMsgByBullet[0] = `${correctFirstScore[2]}: ${correctFirstScore[3]}`;
        if (correctFirstScore[1].includes('friend')) {
          await DatabaseDuccUtils.insertOrUpdateDuccScores(splitMsgByBullet, 'friend');
          myEmitter.emit('friendScore');
        } else if (correctFirstScore[1].includes('killer')) {
          await DatabaseDuccUtils.insertOrUpdateDuccScores(splitMsgByBullet, 'killer');
          myEmitter.emit('killedScore');
        }
      }
    }
  }

  private sendPrivMessage(message: string) {
    this.client.write(`PRIVMSG ${this.joinConfig.channel} :${message}\r\n`);
  }

  public sendDuccMessage(type: DuccMessageTrigger) {
    if (type === DuccMessageTriggerType.REMINDER) {
      this.sendPrivMessage('Reminder to trigger .fr or .kille 🦆');
      return;
    }
    this.sendPrivMessage(`.${type}`);
  }
}

export { IrcMessageProcessor };

export interface IrcMessage {
  prefix?: string;
  command: string;
  params: string[];
}

type PossibleIrcCommand = 'JOIN' | 'PART' | 'QUIT' | 'KICK' | '353' | 'PING' | 'MODE' | 'PRIVMSG';
type DuccMessageTrigger =
  | DuccMessageTriggerType.FRIENDS
  | DuccMessageTriggerType.KILLERS
  | DuccMessageTriggerType.REMINDER;
export enum DuccMessageTriggerType {
  FRIENDS = 'fr',
  KILLERS = 'kille',
  REMINDER = 'reminder',
}
