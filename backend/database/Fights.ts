import {FightMsgParseResult} from '../irc/IrcMessageProcessor';
import {LogWrapper} from '../utils/logging/LogWrapper';
import knex from './dbConn';

const log = new LogWrapper(module.id);

class DatabaseFightUtils {
  static async insertOrUpdateFightScores(fightResult: FightMsgParseResult): Promise<void> {
    if (!fightResult.valid) {
      log.error('Invalid fight result passed to insertOrUpdateFightScores');
      return;
    }

    const tableName = 'fight_scores';

    // Insert or update winner
    await knex(tableName)
        .select()
        .where({user : fightResult.winner})
        .then(async (rows) => {
          if (rows.length === 0) {
            await knex(tableName).insert(
                {user : fightResult.winner, wins : 1, losses : 0});
          } else {
            await knex(tableName)
                .where({user : fightResult.winner})
                .increment('wins', 1);
          }
        });

    // Insert or update loser
    await knex(tableName)
        .select()
        .where({user : fightResult.loser})
        .then(async (rows) => {
          if (rows.length === 0) {
            await knex(tableName).insert(
                {user : fightResult.loser, wins : 0, losses : 1});
          } else {
            await knex(tableName)
                .where({user : fightResult.loser})
                .increment('losses', 1);
          }
        });
  }
}

export { DatabaseFightUtils };
