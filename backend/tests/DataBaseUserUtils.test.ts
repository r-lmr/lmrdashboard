import { DatabaseUserUtils } from '../irc/utils/db/Users';
import { IrcMessage, IrcMessageProcessor } from '../irc/IrcMessageProcessor';
import { JoinConfig } from '../irc/ircconnection';

const mockJoinConfig: JoinConfig = {
  channel: '#channel',
  user: 'testuser',
  bufferTime: new Date(),
};

test('nicks with roles to be sorted are sorted successfully', () => {
  const users = ['+B', '@B', '+A', 'A', '%A', 'B', '%B', '@A'];
  const sortedUsers = DatabaseUserUtils.getSortedUsersByRoleAndAlphabetically(users);
  expect(sortedUsers).toEqual(['@A', '@B', '%A', '%B', '+A', '+B', 'A', 'B']);
});

test('warning is printed if number of users differs', () => {
  const consoleSpy = jest.spyOn(console, 'warn');
  const users = ['+B', '@B', '+A', 'A', '%A', 'B', '%B', '@A', '@A']; // Notice duplicate user
  const sortedUsers = DatabaseUserUtils.getSortedUsersByRoleAndAlphabetically(users);
  expect(sortedUsers).toEqual(['@A', '@B', '%A', '%B', '+A', '+B', 'A', 'B']);
  expect(consoleSpy).toHaveBeenCalledWith('Sorting users resulted in different number of users');
});

test('insert and delete nick on join/part', async () => {
  const mockJoin = ':Nick!Nick@user/Nick JOIN #aboftytest';
  const mockPart = ':Nick!Nick@user/Nick PART #aboftytest';
  const ircMessageProcessor = await IrcMessageProcessor.Instance(null!, mockJoinConfig);
  const message1 = await ircMessageProcessor.parseMessage(mockJoin);
  const message2 = await ircMessageProcessor.parseMessage(mockPart);
  await ircMessageProcessor.processIrcMessage(message1);
  await ircMessageProcessor.processIrcMessage(message2);
});
