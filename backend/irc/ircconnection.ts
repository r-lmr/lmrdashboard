import { connect, TLSSocket } from 'tls';
import { createInterface } from 'readline';
import dotenv from 'dotenv';
dotenv.config();
import { IrcMessage, IrcMessageProcessor } from './IrcMessageProcessor';

const options = {
  host: process.env.LMRD_IRC_HOST,
};

const client: TLSSocket = connect(Number(process.env.LMRD_IRC_PORT) || 6697, options, async () => {
  console.log('connected to server!');
  client.write(`USER ${process.env.LMRD_IRC_USER} localhost * :LMR Dashboard Connection\r\n`);
  client.write(`NICK ${process.env.LMRD_IRC_USER} \r\n`);
  setTimeout(() => {
    client.write(`PRIVMSG nickserv IDENTIFY ${process.env.LMRD_IRC_PASS}\r\n`);
  }, 2000);
});
const rl = createInterface({ input: client, crlfDelay: Infinity });

const joinConfig: JoinConfig = {
  channel: process.env.LMRD_IRC_CHANNEL || '#linuxmasterrace',
  user: process.env.LMRD_IRC_USER || 'lmrdashboard',
  bufferTime: new Date(),
};

const ircMessageProcessor = IrcMessageProcessor.Instance(client, joinConfig);

rl.on('line', async (line: string) => {
  // for some reason the chunks arent always parsed as lines by \r\n
  // so we force it by splitting our selves then loop over each line
  const ircMessage: IrcMessage = ircMessageProcessor.parseMessage(line);

  if (ircMessage.command == 'PING') {
    ircMessageProcessor.processPing(ircMessage);
  } else if (ircMessage.command == 'MODE') {
    ircMessageProcessor.processMode();
  } else if (ircMessage.command == 'JOIN') {
    await ircMessageProcessor.processJoin(ircMessage);
  } else if (ircMessage.command == '353') {
    await ircMessageProcessor.process353(ircMessage);
  } else if (ircMessage.command == 'PART') {
    await ircMessageProcessor.processPart(ircMessage);
  } else if (ircMessage.command == 'PRIVMSG') {
    await ircMessageProcessor.processPrivMsg(ircMessage);
  }
});

client.on('end', () => {
  console.log('disconnected from server');
});

export interface JoinConfig {
  channel: string;
  user: string;
  bufferTime: Date;
}
