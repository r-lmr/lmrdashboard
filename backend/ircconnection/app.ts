import { connect } from 'tls';
import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import dotenv from 'dotenv';
dotenv.config();
import myEmitter from './utils/emitter';
import { addUser } from './utils/db/Users';

interface IrcMessage {
  prefix?: string;
  command: string;
  params: string[];
}

const parseMessage = (line: string): IrcMessage => {
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
};

const options = {
  key: readFileSync('/home/aboft/lmrdashboard/backend/keys/key.pem'),
  cert: readFileSync('/home/aboft/lmrdashboard/backend/keys/cert.pem'),
  host: 'irc.snoonet.org',
};

const client = connect(6697, options, async () => {
  console.log('connected to server!');
  client.write(`USER ${process.env.IRC_USER} localhost * :LMR Dashboard Connection\r\n`);
  client.write(`NICK ${process.env.IRC_USER} \r\n`);
  client.write(`PRIVMSG nickserv IDENTIFY ${process.env.IRC_PASS}\r\n`);
});
const rl = createInterface({ input: client, crlfDelay: Infinity });

const names: string[] = [];

rl.on('line', (line) => {
  // for some reason the chunks arent always parsed as lines by \r\n
  // so we force it by splitting our selves then loop over each line
  const ircMessage: IrcMessage = parseMessage(line);
  if (ircMessage.command == 'PING') {
    client.write('PONG ' + ircMessage.params[0] + '\r\n');
  } else if (ircMessage.command == 'MODE') {
    client.write('JOIN #linuxmasterrace\r\n');
    client.write('NAMES #linuxmasterrace\r\n');
    console.log('TRYING TO JOIN #ABOFTYTEST');
  } else if (ircMessage.command == 'JOIN') {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    if (nick != 'tstestbot') myEmitter.emit('join', ircMessage.params[0].split(' ', 1)[0].replace(':', ''), nick);
  } else if (ircMessage.command == '353') {
    ircMessage.params.slice(3).forEach(async (name) => {
      name = name.replace(':', '').trim();
      if (name.length > 0 && !names.includes(name)) {
        names.push(name);
        await addUser(name, '#' + ircMessage.params[2].slice(1));
      }
    });
  } else if (ircMessage.command == 'PART') {
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    myEmitter.emit('part', ircMessage.params[0].split(' ', 1)[0].replace(':', ''), nick);
  } else if (ircMessage.command == 'PRIVMSG' && !ircMessage.prefix?.toLowerCase().includes('bot@')) {
    const server = ircMessage.params[0];
    const msg = ircMessage.params.slice(1).join(' ').substring(1, 256);
    const nick = ircMessage.prefix && ircMessage.prefix.split('!')[0].slice(1);
    myEmitter.emit('line', nick, server, msg);
  }
});

client.on('end', () => {
  console.log('disconnected from server');
});
