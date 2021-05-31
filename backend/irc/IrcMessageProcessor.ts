import { TLSSocket } from 'tls';
import { JoinConfig } from './ircconnection';
import { DatabaseDuccUtils } from '../database/DuccScores';
import { DatabaseMessageUtils } from '../database/Messages';
import { DatabaseUserUtils } from '../database/Users';
import myEmitter from './utils/emitter';
import { LogWrapper } from '../utils/logging/LogWrapper';
import { DatabaseFightUtils } from '../database/Fights';

const log = new LogWrapper(module.id);

/**
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
    log.debug('Parsing new IRC message');
    log.info(`New message: ${line}`);

    // Create variables with default values
    let prefix = undefined;
    let command = '';
    const params = [];

    // Iterate through the string.
    // If we parse one section fully we add
    // it's consumed amount of chars to i
    for (let i = 0; i < line.length; ) {
      if (i == 0 && line[i] == ':') {
        // If the first character is a colon everything
        // till the next space character is the prefix
        const end = line.indexOf(' ', i);
        prefix = line.slice(i + 1, end);
        i = end + 1;
      } else if (line[i] == ':') {
        // If there is any other colon we treat
        // everything following it as one final parameter
        params.push(line.slice(i + 1, line.length));
        break;
      } else {
        // Catch all to parse the rest
        let end = line.indexOf(' ', i);
        end = end == -1 ? line.length : end;

        if (command == '') {
          // If command is not set then we are parsing
          // the first parameter which is the command
          command = line.slice(i, end);
        } else {
          // Everything else is a single word parameter
          params.push(line.slice(i, end));
        }

        i = end + 1;
      }
    }

    // Returns the object now with populated fields
    return {
      prefix: prefix,
      command: command,
      params: params,
    };
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
    const param = ircMessage.params[1];
    if (param.includes('assword incorrect') || param.includes('is not registered')) {
      log.warn('PASSWORD IS NOT CORRECT. NICK WILL BE CHANGED.');
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
        log.debug('running names command');
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
    const oldNick = ircMessage.prefix?.split('!')[0];
    const newNick = ircMessage.params[0];
    await DatabaseUserUtils.updateUser('KEEP', oldNick!, newNick);
    myEmitter.emit('join');
  }

  private async processJoin(ircMessage: IrcMessage): Promise<void> {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0];
    if (nick != this.joinConfig.user) {
      nick!.match(/^[@|%|+]/)
        ? await DatabaseUserUtils.addUser(nick!.slice(1), nick![0])
        : await DatabaseUserUtils.addUser(nick!, null);
      myEmitter.emit('join');
    }
  }

  private async process353(ircMessage: IrcMessage): Promise<void> {
    ircMessage.params[3].split(' ').forEach(async (name) => {
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
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0];
    await DatabaseUserUtils.deleteUser(nick!);
    myEmitter.emit('part');
    log.debug('RUNNING PARTANDQUIT');
  }

  private async processKick(ircMessage: IrcMessage) {
    const nick = ircMessage.params[1];
    await DatabaseUserUtils.deleteUser(nick!);
    myEmitter.emit('part');
    log.debug('RUNNING KICK');
  }

  private async processPrivMsg(ircMessage: IrcMessage) {
    if (Date.now() - this.joinConfig.bufferTime.getTime() < 5000) return;

    const msg = ircMessage.params[1];
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0];
    const server = ircMessage.params[0];

    // Process non bot messages
    if (!ircMessage.prefix?.toLowerCase().split('@')[1].includes('/bot/')) {
      await DatabaseMessageUtils.saveLine(nick!, server, msg, false);
      myEmitter.emit('line');
    } else {
      await DatabaseMessageUtils.saveLine(nick!, server, msg, true);
      myEmitter.emit('line');
      // Process bot messages
      // Process ducc stats
      if (nick === 'gonzobot') {
        if (IrcMessageProcessor.matchesDuccMsg(msg)) {
          const duccMsg = ircMessage.params[1];
          const splitMsgByBullet = duccMsg.split('\u2022');

          // fix the first split by removing the 'Duck ... scores in #channel'
          const correctFirstScore = splitMsgByBullet[0].split(':');
          splitMsgByBullet[0] = `${correctFirstScore[1]}: ${correctFirstScore[2].trim()}`;

          if (correctFirstScore[0].includes('friend')) {
            await DatabaseDuccUtils.insertOrUpdateDuccScores(splitMsgByBullet, 'friend');
            myEmitter.emit('friendScore');
          } else if (correctFirstScore[0].includes('killer')) {
            await DatabaseDuccUtils.insertOrUpdateDuccScores(splitMsgByBullet, 'killer');
            myEmitter.emit('killedScore');
          }
        }
        // Process fight messages
        const fightMsgParseResult = IrcMessageProcessor.matchesFightMsg(msg);
        if (fightMsgParseResult.valid) {
          await DatabaseFightUtils.insertOrUpdateFightScores(fightMsgParseResult);
          await DatabaseFightUtils.insertOrUpdateFightScoresRelations(fightMsgParseResult);
          log.debug("Fight parse result", {fightMsgParseResult});
          myEmitter.emit('fightScore');
        }
      }
    }
  }

  private static matchesDuccMsg(s: string): boolean {
    return /Duck \w{6} scores in #/i.test(s);
  }

  public static matchesFightMsg(s: string): FightMsgParseResult {
    // Thanks audron for the beautiful initial regex
    const match = /(?:\w+! ){3}(?<winner>\w+) (?:\w+ ){1,3}over (?<loser>\w+) with (?:\w+[ .]){1,4}/.exec(s);
    if (match == null) {
      return {valid : false};
    }
    return {valid : true, winner : match.groups!.winner, loser : match.groups!.loser};
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

export interface FightMsgParseResult {
  valid: boolean;
  winner?: string;
  loser?: string;
}
