import knex from './dbConn';

class DatabaseDuccUtils {
  static async insertOrUpdateFriendScores(scores: string[]) {
    scores.forEach(async (scoreString) => {
      const score: string[] = scoreString.split(':');
      const duccs: number = parseInt(score[1].replace(',', ''));
      await knex('friend_scores')
        .select()
        .where({ user: score[0] })
        .then(async (rows) => {
          if (rows.length === 0) {
            await knex('friend_scores').insert({ user: score[0], duccs });
          } else {
            await knex('friend_scores').where({ user: score[0] }).update({ duccs });
          }
        });
    });
  }

  static async insertOrUpdateKillerScores(scores: string[]) {
    console.log(scores);
    scores.forEach(async (scoreString) => {
      const score: string[] = scoreString.split(':');
      const duccs: number = parseInt(score[1].replace(',', ''));
      await knex('killer_scores')
        .select()
        .where({ user: score[0] })
        .then(async (rows) => {
          if (rows.length === 0) {
            await knex('killer_scores').insert({ user: score[0], duccs });
          } else {
            await knex('killer_scores').where({ user: score[0] }).update({ duccs });
          }
        });
    });
  }
  static async retrieveAllDuccScores() {
    const allFriendScoresDB = await knex('friend_scores').select().orderBy('duccs', 'desc').limit(10);
    const allKillerScoresDB = await knex('killer_scores').select().orderBy('duccs', 'desc').limit(10);
    const duccFriends = allFriendScoresDB.map((entry) => {
      return { user: entry['user'], duccs: entry['duccs'] };
    });
    const duccKillers = allKillerScoresDB.map((entry) => {
      return { user: entry['user'], duccs: entry['duccs'] };
    });
    return { duccFriends, duccKillers };
  }
}
export { DatabaseDuccUtils };
