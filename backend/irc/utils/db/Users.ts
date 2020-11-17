import knex from './dbConn';

class DatabaseUserUtils {
  static async getUsers(server: string) {
    const allUsersDB = await knex('online_users').select('user').where({ server });
    const allUsers = allUsersDB.map((user) => user['user']);
    return allUsers;
  }

  static async deleteUser(nick: string, server: string) {
    await knex('online_users').del().where({ user: nick, server });
    const user = await knex('online_users').select('user').where({ user: nick, server: server });
    console.log(`User ${nick} has parted.`);
  }

  static async addUser(nick: string, server: string) {
    await knex('online_users')
      .insert({ user: nick, server })
      .catch((e) => {
        //ignore any duplicate users that may be in table
        //example: disconnecting from IRC
        if (e.errno != 1062) console.log(e);
      });
    console.log(`${nick} has come online.`);
  }

  static async flushUserTable(server: string) {
    try {
      console.log('ATTEMPTING TO CLEAR USER TABLE ON START');
      await knex('online_users').where({ server }).del();
    } catch (e) {
      console.log('UNABLE TO DELETE USERS');
      console.log(e);
    }
  }
}

export { DatabaseUserUtils };
