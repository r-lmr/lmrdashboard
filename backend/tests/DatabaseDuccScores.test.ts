import { DatabaseDuccUtils } from '../database/DuccScores';
import { IrcMessageProcessor } from '../irc/IrcMessageProcessor';
import { JoinConfig } from '../irc/ircconnection';

const mockJoinConfig: JoinConfig = {
  channel: '#aboftytest',
  user: 'lmraboft',
  bufferTime: new Date(),
};

test('parse scores correctly based off of friend or killer', async () => {
  const mockFriendScoresMsg = `:gonzobot!gonzo@snoonet/bot/gonzobot PRIVMSG #aboftytest :(aboft) Duck friend scores in #aboftytest: a​bofty: 1,777 • a​boft: 13213 • Asmodean: 6,9,49`;
  const mockKillerScoresMsg = `:gonzobot!gonzo@snoonet/bot/gonzobot PRIVMSG #aboftytest :(aboft) Duck killer scores in #aboftytest: a​smodean: 1 • a​boft: 13213 • Asmodean: 6,9,49`;
  const ircMessageProcessor = await IrcMessageProcessor.Instance(null!, mockJoinConfig);
  const mockFriendScores = await ircMessageProcessor.parseMessage(mockFriendScoresMsg);
  const mockKillerScores = await ircMessageProcessor.parseMessage(mockKillerScoresMsg);
  await ircMessageProcessor.processIrcMessage(mockFriendScores);
  await ircMessageProcessor.processIrcMessage(mockKillerScores);
});

test('insert or update ducc scores', async () => {
  const friendScore = ['aboft: 1234', 'asmodean: 1,324,23'];
  const killerScore = ['audron: 5,443', 'alexendoo: 44'];

  await DatabaseDuccUtils.insertOrUpdateDuccScores(friendScore, 'friend');
  await DatabaseDuccUtils.insertOrUpdateDuccScores(killerScore, 'killer');
});
