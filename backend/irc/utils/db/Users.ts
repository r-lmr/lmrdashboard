import knex from './dbConn';
import SortedSet from 'collections/sorted-set';

class DatabaseUserUtils {
  static async getUsers(server: string) {
    const allUsersDB = await knex('online_users').select('user').where({ server });
    const allUsers = allUsersDB.map((user) => user['user']);
    return allUsers;
  }

  static async deleteUser(nick: string, server: string) {
    await knex('online_users')
      .select('user')
      .where('user', 'like', `%${nick}`)
      .andWhere({ server })
      .orderBy('user', 'asc')
      .then(async (retrievedUser) => {
        if (retrievedUser.length > 1 && retrievedUser[0]) {
          console.log('ATTEMPTING TO DELETE PARTED/QUIT USER ' + nick);
          console.log(retrievedUser, retrievedUser[0]);
          await knex('online_users').del().where({ user: retrievedUser[0]['user'] });
        }
      })
      .catch((e) => console.log('ERROR IN Users.deleteUser', e));
    console.log(`User ${nick} has parted.`);
  }

  static async addUser(nick: string, server: string) {
    console.log('ATTEMPTING TO ADD NEW USER ' + nick);
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
      const deleted = await knex('online_users').where({ server }).del();
      if (deleted) console.log('DELETED ALL USERS');
    } catch (e) {
      console.log('UNABLE TO DELETE USERS');
    }
  }

  private static getUserRole(nickWithRole: string): UserRole {
    if (
      !(
        nickWithRole.startsWith(UserRole.OP) ||
        nickWithRole.startsWith(UserRole.HOP) ||
        nickWithRole.startsWith(UserRole.VOICE)
      )
    ) {
      return UserRole.NONE;
    }
    return nickWithRole.slice(0, 1) as UserRole;
  }

  private static getSortedUserMapWithRoles(nicksWithRoles: string[]): RolesNickMap {
    const rolesNickMap: RolesNickMap = new Map<UserRole, SortedSet<string>>();
    rolesNickMap.set(UserRole.OP, new SortedSet<string>());
    rolesNickMap.set(UserRole.HOP, new SortedSet<string>());
    rolesNickMap.set(UserRole.VOICE, new SortedSet<string>());
    rolesNickMap.set(UserRole.NONE, new SortedSet<string>());

    for (const nickWithRole of nicksWithRoles) {
      const role: UserRole = this.getUserRole(nickWithRole);
      rolesNickMap.get(role)!.push(nickWithRole);
    }

    return rolesNickMap;
  }

  /**
   * Returns a list of strings sorted first by role, then alphabetically
   * Role precedence: @, %, +
   * @param nicksWithRoles list of strings of nicks prepended with their role
   * @returns list of strings of nicks prepended with their role but sorted
   */
  static getSortedUsersByRoleAndAlphabetically(nicksWithRoles: string[]): string[] {
    const rolesNickMap: RolesNickMap = DatabaseUserUtils.getSortedUserMapWithRoles(nicksWithRoles);
    const sortedUsers: string[] = Array.from(rolesNickMap).flatMap(([_, value]) => value.toArray());

    if (nicksWithRoles.length !== sortedUsers.length)
      console.warn('Sorting users resulted in different number of users');

    return sortedUsers;
  }
}

export { DatabaseUserUtils };

export type RolesNickMap = Map<UserRole, SortedSet<string>>;

export enum UserRole {
  OP = '@',
  HOP = '%',
  VOICE = '+',
  NONE = 'NOROLE',
}
