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
  private modeState = false;
  private readonly client: TLSSocket;
  private readonly joinConfig: JoinConfig;
  //private readonly names: string[];
  private readonly parseCommands: Map<PossibleIrcCommand, (ircMessage: IrcMessage) => void>;

  private constructor(client: TLSSocket, joinConfig: JoinConfig) {
    this.client = client;
    this.joinConfig = joinConfig;
    //this.names = [];
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
      // console.log('FIRST RETURN MSG IrcMessageProcessor\n', msg);
      return msg;
    } else {
      const input = line.split(' ');
      const msg = { command: input[0], params: [input[1]] };
      // console.log('SECOND RETURN MSG IrcMessageProcessor\n', msg);
      return msg;
    }
  }

  private processPing(ircMessage: IrcMessage) {
    this.client.write('PONG ' + ircMessage.params[0] + '\r\n');
  }

  private async runNamesCommand() {
    // we can run this command when more than one user is being
    // role promoted or revoked (ex. netsplits)
    this.client.write(`NAMES ${this.joinConfig.channel}\r\n`);
    console.log(`TRYING TO JOIN ${this.joinConfig.channel}`);
  }

  private async processMode(ircMessage: IrcMessage) {
    console.log('MODE FUNCTION\n', ircMessage);
    if (!this.modeState) {
      // we only want to try and join once but we can toggle the state
      // to prevent multiple joins and only run NAMES when needed
      this.client.write(`JOIN ${this.joinConfig.channel}\r\n`);
      this.runNamesCommand();
      this.modeState = true;
    } else if (ircMessage.params[1].match(/[o|h|v]/)) {
      // update joining user with role
      const [server, roleMode, user] = ircMessage.params;
      // anything that has more than just one promotion parameter
      // we will let the NAMES parse handle the assignment of roles
      if (roleMode.length > 2) {
        DatabaseUserUtils.flushUserTable(this.joinConfig.channel);
        console.log('running names command');
        this.runNamesCommand();
        return;
      }
      let role = null;
      switch (roleMode) {
        case '+o':
          role = '@';
          break;
        case '+h':
          role = '%';
          break;
        case '+v':
          role = '+';
          break;
        case '-v' || '-h' || '-o':
          role = null;
          break;
      }
      await DatabaseUserUtils.updateUser(user, role, server);
      myEmitter.emit('join');
    }
  }

  private async processJoin(ircMessage: IrcMessage) {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    if (nick != this.joinConfig.user) {
      const server: string = ircMessage.params[0].split(' ', 1)[0].replace(':', '');
      console.log(nick, nick!.slice(1), nick![0] === '@' || '%' || '+');
      nick!.match(/^[@|%|+]/)
        ? await DatabaseUserUtils.addUser(nick!.slice(1), nick![0], server)
        : await DatabaseUserUtils.addUser(nick!, null, server);
      myEmitter.emit('join');
    }
  }

  private async process353(ircMessage: IrcMessage) {
    console.log(ircMessage);
    ircMessage.params.slice(3).forEach(async (name) => {
      name = name.replace(':', '').trim();
      if (name.length > 0) {
        // I'm removing refs to this.names as it does not seem to be needed
        // no sense in tracking names in a local array when stored in DB as well
        //&& !this.names.includes(name)
        // this.names.push(name);
        const server = '#' + ircMessage.params[2].slice(1);
        // add second column to host the role to join with nick later
        name.match(/^[@|%|+]/)
          ? await DatabaseUserUtils.addUser(name.slice(1), name[0], server)
          : await DatabaseUserUtils.addUser(name, null, server);
        myEmitter.emit('join');
      }
    });
  }

  private async processPartAndQuit(ircMessage: IrcMessage) {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    await DatabaseUserUtils.deleteUser(nick!, this.joinConfig.channel);
    myEmitter.emit('part');
    console.log('RUNNING PARTANDQUIT');
  }

  private async processKick(ircMessage: IrcMessage) {
    const nick = ircMessage.params[1];
    await DatabaseUserUtils.deleteUser(nick!, this.joinConfig.channel);
    myEmitter.emit('part');
    console.log('RUNNING KICK');
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

type ModeOP = {
  mode: '+o';
  role: '@';
};
type ModeHOP = {
  mode: '+h';
  role: '%';
};
type ModeVoice = {
  mode: '+v';
  role: '+';
};
type ModeRole = ModeOP | ModeHOP | ModeVoice;
