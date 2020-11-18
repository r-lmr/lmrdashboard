import { join } from "path";
import { TLSSocket } from "tls";
import { JoinConfig } from "./ircconnection";
import { DatabaseDuccUtils } from "./utils/db/DuccScores";
import { DatabaseMessageUtils } from "./utils/db/Messages";
import { DatabaseUserUtils } from "./utils/db/Users";
import myEmitter from './utils/emitter';

/*
 * Singleton
 */
class IrcMessageProcessor {
  private static _instance: IrcMessageProcessor;
  private readonly client: TLSSocket;
  private readonly joinConfig: JoinConfig;
  private readonly names: string[];

  private constructor(client: TLSSocket, joinConfig: JoinConfig) {
    this.client = client;
    this.joinConfig = joinConfig;
    this.names = [];
  }

  public static Instance(client: TLSSocket, joinConfig: JoinConfig) {
    return this._instance || (this._instance = new this(client, joinConfig));
  }

  public parseMessage(line: string): IrcMessage {
    console.log("parseMessage");
    
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
      return msg;
    }
  }

  public processPing(ircMessage: IrcMessage) {
    console.log("processPing", ircMessage);
    this.client.write('PONG ' + ircMessage.params[0] + '\r\n');
  }

  public processMode() {
    console.log("processMode");
    this.client.write(`JOIN ${this.joinConfig.channel}\r\n`);
    this.client.write(`NAMES ${this.joinConfig.channel}\r\n`);
    console.log(`TRYING TO JOIN ${this.joinConfig.channel}`);
  }

  public async processJoin(ircMessage: IrcMessage) {
    console.log("processJoin", ircMessage);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    if (nick != this.joinConfig.user) {
      const server: string = ircMessage.params[0].split(' ', 1)[0].replace(':', '');
      await DatabaseUserUtils.addUser(nick!, server);
      myEmitter.emit('join');
    }
  }

  public async process353(ircMessage: IrcMessage) {
    console.log("process353", ircMessage);
    ircMessage.params.slice(3).forEach(async (name) => {
      name = name.replace(':', '').trim();
      if (name.length > 0 && this.names.includes(name)) {
        this.names.push(name);
        const server = '#' + ircMessage.params[2].slice(1);
        await DatabaseUserUtils.addUser(name, server);
      }
    });
  }

  public async processPart(ircMessage: IrcMessage) {
    console.log("processPart", ircMessage);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    const server = ircMessage.params[0].split(' ', 1)[0].replace(':', '');
    await DatabaseUserUtils.deleteUser(nick!, server);
    myEmitter.emit('part');
  }

  public async processPrivMsg(ircMessage: IrcMessage) {
    console.log("processPrivMsg", ircMessage);
    if (Date.now() - this.joinConfig.bufferTime.getTime() < 5000)
      return;

    // Normal messages can only hold 256 chars in the database
    const msg = ircMessage.params.slice(1).join(' ').substring(1, 256);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    const server = ircMessage.params[0];

    // Process non bot messages
    if (!ircMessage.prefix?.toLowerCase().split('@')[1].includes('/bot/')) {
      await DatabaseMessageUtils.saveLine(nick!, server, msg);
      myEmitter.emit('line');
    } else { // Process bot messages
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

}

export { IrcMessageProcessor };

export interface IrcMessage {
  prefix?: string;
  command: string;
  params: string[];
}
