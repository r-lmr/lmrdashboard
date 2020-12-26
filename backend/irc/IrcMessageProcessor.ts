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
  private readonly parseCommands: Map<PossibleIrcCommand, (ircMessage: IrcMessage) => void>;

  private constructor(client: TLSSocket, joinConfig: JoinConfig) {
    this.client = client;
    this.joinConfig = joinConfig;
    this.parseCommands = new Map<PossibleIrcCommand, (ircMessage: IrcMessage) => void>();
    this.parseCommands.set('PING', this.processPing.bind(this));
    this.parseCommands.set('MODE', this.processMode.bind(this));
    this.parseCommands.set('JOIN', this.processJoin.bind(this));
    this.parseCommands.set('353', this.process353.bind(this));
    this.parseCommands.set('PART', this.processPartAndQuit.bind(this));
    this.parseCommands.set('KICK', this.processKick.bind(this));
    this.parseCommands.set('QUIT', this.processPartAndQuit.bind(this));
    this.parseCommands.set('PRIVMSG', this.processPrivMsg.bind(this));
    this.parseCommands.set('NICK', this.processNick.bind(this));
    this.parseCommands.set('900', this.process900Command.bind(this));
    this.parseCommands.set('NOTICE', this.processNotice.bind(this));
  }

  public static Instance(client: TLSSocket, joinConfig: JoinConfig) {
    return this._instance || (this._instance = new this(client, joinConfig));
  }

  public processIrcMessage(ircMessage: IrcMessage) {
    if (this.parseCommands.has(ircMessage.command as PossibleIrcCommand))
      this.parseCommands.get(ircMessage.command as PossibleIrcCommand)!(ircMessage);
  }

  public parseMessage(line: string): IrcMessage {
    console.log(line);
    // for some reason the chunks arent always parsed as lines by \r\n
    // so we force it by splitting our selves then loop over each line
    if (line[0] == ':') {
      const input = line.split(' ');
      const msg = {
        prefix: input[0],
        command: input[1],
        params: input.slice(2),
      };
      return msg;
    } else {
      const input = line.split(' ');
      const msg = { command: input[0], params: [input[1]] };
      // console.log('SECOND RETURN MSG IrcMessageProcessor\n', msg);
      return msg;
    }
  }

  private processPing(ircMessage: IrcMessage): void {
    this.client.write('PONG ' + ircMessage.params[0] + '\r\n');
  }

  private runNamesCommand(): void {
    // we can run this command when more than one user is being
    // role promoted or revoked (ex. netsplits)
    this.client.write(`NAMES ${this.joinConfig.channel}\r\n`);
  }

  private process900Command(ircMessage: IrcMessage): void {
    this.client.write(`JOIN ${this.joinConfig.channel}\r\n`);
  }

  private processNotice(ircMessage: IrcMessage): void {
    const param = ircMessage.params.slice(1).join(' ');
    if (param.includes('assword incorrect')) {
      console.log('PASSWORD IS NOT CORRECT. NICK WILL BE CHANGED.');
      this.client.write(`JOIN ${this.joinConfig.channel}\r\n`);
    }
  }

  private async processMode(ircMessage: IrcMessage): Promise<void> {
    if (!this.modeState) {
      // we only want to try and join once but we can toggle the state
      // to prevent multiple joins and only run NAMES when needed

      this.runNamesCommand();
      this.modeState = true;
    } else if (ircMessage.params[1].match(/[o|h|v]/)) {
      // update joining user with role
      const [server, roleMode, user] = ircMessage.params;
      // anything that has more than just one promotion parameter
      // we will let the NAMES parse handle the assignment of roles
      if (roleMode.length > 2) {
        DatabaseUserUtils.flushUserTable();
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
      await DatabaseUserUtils.updateUser(role, user);
      myEmitter.emit('join');
    }
  }

  private async processNick(ircMessage: IrcMessage): Promise<void> {
    const oldNick = ircMessage.prefix?.split('!')[0].slice(1);
    const newNick = ircMessage.params[0];
    await DatabaseUserUtils.updateUser('KEEP', oldNick!, newNick);
    myEmitter.emit('join');
  }

  private async processJoin(ircMessage: IrcMessage): Promise<void> {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    if (nick != this.joinConfig.user) {
      console.log(nick, nick!.slice(1), nick![0] === '@' || '%' || '+');
      nick!.match(/^[@|%|+]/)
        ? await DatabaseUserUtils.addUser(nick!.slice(1), nick![0])
        : await DatabaseUserUtils.addUser(nick!, null);
      myEmitter.emit('join');
    }
  }

  private async process353(ircMessage: IrcMessage): Promise<void> {
    ircMessage.params.slice(3).forEach(async (name) => {
      name = name.replace(':', '').trim();
      if (name.length > 0) {
        // add second column to host the role to join with nick later
        name.match(/^[@|%|+]/)
          ? await DatabaseUserUtils.addUser(name.slice(1), name[0])
          : await DatabaseUserUtils.addUser(name, null);
        myEmitter.emit('join');
      }
    });
  }

  private async processPartAndQuit(ircMessage: IrcMessage) {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    await DatabaseUserUtils.deleteUser(nick!);
    myEmitter.emit('part');
    console.log('RUNNING PARTANDQUIT');
  }

  private async processKick(ircMessage: IrcMessage) {
    const nick = ircMessage.params[1];
    await DatabaseUserUtils.deleteUser(nick!);
    myEmitter.emit('part');
    console.log('RUNNING KICK');
  }

  private async processPrivMsg(ircMessage: IrcMessage) {
    if (Date.now() - this.joinConfig.bufferTime.getTime() < 5000) return;

    // Normal messages can only hold 256 chars in the database
    const msg = ircMessage.params.slice(1).join(' ').substring(1, 256);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    const server = ircMessage.params[0];

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

type PossibleIrcCommand =
  | 'JOIN'
  | 'PART'
  | 'QUIT'
  | 'KICK'
  | '353'
  | 'PING'
  | 'MODE'
  | 'PRIVMSG'
  | 'NICK'
  | '900'
  | 'NOTICE';
type DuccMessageTrigger =
  | DuccMessageTriggerType.FRIENDS
  | DuccMessageTriggerType.KILLERS
  | DuccMessageTriggerType.REMINDER;
export enum DuccMessageTriggerType {
  FRIENDS = 'fr',
  KILLERS = 'kille',
  REMINDER = 'reminder',
}
