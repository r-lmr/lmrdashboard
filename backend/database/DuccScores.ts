import knex from './dbConn';

class DatabaseDuccUtils {
  static async insertOrUpdateDuccScores(scores: string[], duccType: string): Promise<void> {
    let tableName: string;
    duccType == 'friend' ? (tableName = 'friend_scores') : (tableName = 'killer_scores');
    scores.forEach(async (scoreString) => {
      // remove any zero width spaces or control chars from gonzobot
      scoreString = scoreString.replace(/[\x02|\u200B]/g, '').trim();
      const score: string[] = scoreString.split(':');
      const duccs: number = parseInt(score[1].trim());
      await knex(tableName)
        .select()
        .where({ user: score[0] })
        .then(async (rows) => {
          if (rows.length === 0) {
            await knex(tableName).insert({ user: score[0], duccs });
          } else {
            await knex(tableName).where({ user: score[0] }).update({ duccs });
          }
        });
    });
  }

  static async retrieveAllDuccScores(): Promise<ReturnDuccScores> {
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

interface DuccScores {
  user: string;
  duccs: number;
}

interface ReturnDuccScores {
  duccFriends: DuccScores[];
  duccKillers: DuccScores[];
}

export { DatabaseDuccUtils };
