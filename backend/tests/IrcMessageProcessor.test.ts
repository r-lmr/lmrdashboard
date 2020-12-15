import { JoinConfig } from '../irc/ircconnection';
import { IrcMessage, IrcMessageProcessor } from '../irc/IrcMessageProcessor';

const mockIrcMessage = {
  prefix: ':Nick!Nick@snoonet.org/user/Nick',
  command: 'PRIVMSG',
  params: ['#channel', ':myMessage'],
};

const mockLine = ':Nick!Nick@snoonet.org/user/Nick PRIVMSG #channel :myMessage';

const mockJoinConfig: JoinConfig = {
  channel: '#channel',
  user: 'testuser',
  bufferTime: new Date(),
};

test('raw IRC message line is parsed to correct IrcMessage object', () => {
  const ircMessageProcessor = IrcMessageProcessor.Instance(null!, mockJoinConfig);
  const ircMessage: IrcMessage = ircMessageProcessor.parseMessage(mockLine);
  expect(ircMessage).toEqual(mockIrcMessage);
});
