// https://github.com/TotallyNotRobots/CloudBot/blob/992586301a567a27342f2f87240123821e0b821e/data/attacks/fight.json#L4

import { IrcMessageProcessor } from "../irc/IrcMessageProcessor";

describe('parsing a fight result', () => {
  test('works for correct message (returns match with winner and loser) 1', async () => {
    const msg = 'ZAM! BOOM! BANG! fear stands victorious over Asmodean with a crushing side kick.';
    const result = IrcMessageProcessor.matchesFightMsg(msg);
    expect(result).toStrictEqual({valid: true, winner: 'fear', loser: 'Asmodean'});
  });

  test('works for correct message (returns match with winner and loser) 2', async () => {
    const msg = 'SLAM! BOOM! POW! someone is the champion over anyone with a fatal haymaker punch.';
    const result = IrcMessageProcessor.matchesFightMsg(msg);
    expect(result).toStrictEqual({valid: true, winner: 'someone', loser: 'anyone'});
  });

  test('works for correct message (returns match with winner and loser) 3', async () => {
    const msg = 'POW! WHACK! KAPOW! Flexyjerkov triumphs over pb with a devastating headbutt.';
    const result = IrcMessageProcessor.matchesFightMsg(msg);
    expect(result).toStrictEqual({valid: true, winner: 'Flexyjerkov', loser: 'pb'});
  });

  test('works for incorrect message (returns no match)', async () => {
    const msg = 'some other message by gonzobot';
    const result = IrcMessageProcessor.matchesFightMsg(msg);
    expect(result).toStrictEqual({valid: false});
  });
});
