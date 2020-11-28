import { connect, TLSSocket } from 'tls';
import { createInterface } from 'readline';
import dotenv from 'dotenv';
dotenv.config();
import { DuccMessageTriggerType, IrcMessage, IrcMessageProcessor } from './IrcMessageProcessor';
import { scheduleDailyEvent } from '../utils/cron';

const options = {
  host: process.env.LMRD_IRC_HOST,
};

const client: TLSSocket = connect(Number(process.env.LMRD_IRC_PORT) || 6697, options, async () => {
  console.log('connected to server!');
  client.write(`PASS ${process.env.LMRD_IRC_PASS}\r\n`);
  client.write(`USER ${process.env.LMRD_IRC_USER} localhost * :LMR Dashboard Connection\r\n`);
  client.write(`NICK ${process.env.LMRD_IRC_USER} \r\n`);
});
const rl = createInterface({ input: client, crlfDelay: Infinity });

const joinConfig: JoinConfig = {
  channel: process.env.LMRD_IRC_CHANNEL || '#linuxmasterrace',
  user: process.env.LMRD_IRC_USER || 'lmrdashboard',
  bufferTime: new Date(),
};

const ircMessageProcessor = IrcMessageProcessor.Instance(client, joinConfig);

rl.on('line', async (line: string) => {
  const ircMessage: IrcMessage = ircMessageProcessor.parseMessage(line);
  ircMessageProcessor.processIrcMessage(ircMessage);
});

// Daily at 01:00-03:00 CST is best according to aboft => 08:00-10:00 GMT+1 (Server time dependent)
scheduleDailyEvent(process.env.LMRD_DUCC_TIME || '09:00', () => {
  console.log(`Sending ducc message at ${new Date().toLocaleTimeString('en')}`);
  ircMessageProcessor.sendDuccMessage(DuccMessageTriggerType.FRIENDS);
  setTimeout(() => {
    ircMessageProcessor.sendDuccMessage(DuccMessageTriggerType.KILLERS);
  }, 5000);
});

client.on('end', () => {
  console.log('disconnected from server');
});

export interface JoinConfig {
  channel: string;
  user: string;
  bufferTime: Date;
}
