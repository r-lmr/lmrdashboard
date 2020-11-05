import { createConnection } from 'net';
import { createInterface } from 'readline';
import dotenv from 'dotenv';
dotenv.config();
import myEmitter from './utils/emitter';
import { addUser } from './utils/db/Users';
import { saveLine } from './utils/db/Messages';

interface IrcMessage {
  prefix?: string;
  command: string;
  params: string[];
}

const parseMessage = (line: string): IrcMessage => {
  if (line[0] == ':') {
    let input = line.split(' ');
    let msg = {
      prefix: input[0],
      command: input[1],
      params: input.slice(2),
    };
    return msg;
  } else {
    let input = line.split(' ');
    let msg = { command: input[0], params: [input[1]] };
    return msg;
  }
};

const client = createConnection({ port: 6667, host: 'irc.snoonet.org' }, async () => {
  console.log('connected to server!');
  client.write('USER tsbottest localhost * :TypeScript Socket Test\r\n');
  client.write('NICK tsbotSTOPUSINGMYNAME\r\n');
});
const rl = createInterface({ input: client, crlfDelay: Infinity });

const names: string[] = [];

rl.on('line', (line) => {
  // for some reason the chunks arent always parsed as lines by \r\n
  // so we force it by splitting our selves then loop over each line
  const ircMessage: IrcMessage = parseMessage(line);
  if (ircMessage.command == 'PING') {
    client.write('PONG ' + ircMessage.params[0] + '\r\n');
    //console.log("PONG " + ircMessage.params[0] + "\r\n");
  } else if (ircMessage.command == 'MODE') {
    client.write('JOIN #aboftytest\r\n');
    client.write('NAMES #aboftytest\r\n');
    console.log('TRYING TO JOIN #ABOFTYTEST');
  } else if (ircMessage.command == 'JOIN') {
    //console.log(line);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    if (nick != 'tstestbot') myEmitter.emit('join', ircMessage.params[0].split(' ', 1)[0].replace(':', ''), nick);
  } else if (ircMessage.command == '353') {
    ircMessage.params.slice(3).forEach(async (name) => {
      name = name.replace(':', '').trim();
      if (name.length > 0 && !names.includes(name)) {
        names.push(name);
        await addUser(name, '#' + ircMessage.params[2].slice(1));
        //console.log(name.length, '#aboftytest');
      }
    });
  } else if (ircMessage.command == 'PART') {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    myEmitter.emit('part', ircMessage.params[0].split(' ', 1)[0].replace(':', ''), nick);
  } else if (ircMessage.command == 'PRIVMSG' && !ircMessage.prefix?.toLowerCase().includes('bot@')) {
    //console.log(ircMessage);
    const server = ircMessage.params[0];
    const msg = ircMessage.params.slice(1).join(' ').substring(1, 256);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    myEmitter.emit('line', nick, server, msg);
  } else {
    //console.log(line);
  }
});

myEmitter.on('line', async (nick: string, server: string, msg: string) => {
  await saveLine(nick, server, msg);
  console.log(nick, msg);
});

client.on('end', () => {
  console.log('disconnected from server');
});
