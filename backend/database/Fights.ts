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

  static async insertOrUpdateFightScoresRelations(fightResult: FightMsgParseResult): Promise<void> {
    if (!fightResult.valid) {
      log.error('Invalid fight result passed to insertOrUpdateFightScores');
      return;
    }

    const tableName = 'fight_scores_relations';

    // Insert or update relation
    await knex(tableName)
        .select()
        .where({winner : fightResult.winner, loser: fightResult.loser})
        .then(async (rows) => {
          if (rows.length === 0) {
            await knex(tableName).insert(
                {winner : fightResult.winner, loser : fightResult.loser, times : 1});
          } else {
            await knex(tableName)
                .where({winner : fightResult.winner, loser: fightResult.loser})
                .increment('times', 1);
          }
        });

    // Could also insert the inverse fight relation on a (first) loss with 0.
    // However, this is solved by defaulting to 0 in retrieveTopFightScores
  }

  static async retrieveTopFightScores(): Promise<TopWinnerAndLosers> {
    const topWinnersDb = await knex('fight_scores').select().orderBy('wins', 'desc').limit(10);
    const topLosersDb = await knex('fight_scores').select().orderBy('losses', 'desc').limit(10);

    const topWinners = topWinnersDb.map((entry) => {
      return { user: entry['user'], wins: entry['wins'], losses: entry['losses'] };
    });
    const topLosers = topLosersDb.map((entry) => {
      return { user: entry['user'], wins: entry['wins'], losses: entry['losses'] };
    });

    return { topWinners, topLosers };
  }

  static async retrieveFightRelation(nick1: string, nick2: string):
      Promise<FightRelation|undefined> {
    const winnerIsNick1 =
        await knex('fight_scores_relations')
            .where('winner', 'like', `%${nick1.toLowerCase()}%`)
            .andWhere('loser', 'like', `%${nick2.toLowerCase()}%`)
            .select();
    const winnerIsNick2 =
        await knex('fight_scores_relations')
            .where('winner', 'like', `%${nick2.toLowerCase()}%`)
            .andWhere('loser', 'like', `%${nick1.toLowerCase()}%`)
            .select();

    if (winnerIsNick1.length === 0 && winnerIsNick2.length === 0) {
      log.warn(`No fight relation for nicks ${nick1} and ${nick2} found.`);
      return;
    }

    const pair1Nick1 = winnerIsNick1.map((entry) => entry['winner'])[0];
    const pair1Nick2 = winnerIsNick1.map((entry) => entry['loser'])[0];
    const nick1Wins = winnerIsNick1.map((entry) => entry['times'])[0] || 0;

    const pair2Nick1 = winnerIsNick2.map((entry) => entry['winner'])[0];
    const pair2Nick2 = winnerIsNick2.map((entry) => entry['loser'])[0];
    const nick2Wins = winnerIsNick2.map((entry) => entry['times'])[0] || 0;

    // On one of the pairs the nick might not exist,
    // therefore pick it from where it does
    const nick1Full = pair1Nick1 || pair2Nick1;
    const nick2Full = pair1Nick2 || pair2Nick2;

    return {nick1Full, nick1Wins, nick2Full, nick2Wins};
  }
}

interface FightScore {
  user: string;
  wins: number;
  losses: number;
}

interface TopWinnerAndLosers {
  topWinners: FightScore[];
  topLosers: FightScore[];
}

export interface FightRelation {
  nick1Full: string;
  nick1Wins: number;
  nick2Full: string;
  nick2Wins: number;
}

export { DatabaseFightUtils };
