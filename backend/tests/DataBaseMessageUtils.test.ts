import { DatabaseMessageUtils, IMessage } from '../irc/utils/db/Messages';

test('foo', async () => {
  const messages: IMessage[] = await DatabaseMessageUtils.getLinesLastNDays(7);
  console.log(messages);
  expect(messages.length).toBeGreaterThan(0)
});
