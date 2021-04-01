import SortedSet from 'collections/sorted-set';
import { LogWrapper } from '../utils/logging/LogWrapper';
import knex from './dbConn';

const log = new LogWrapper(module.id);

class DatabaseUserUtils {
  static async getUsers(): Promise<string[]> {
    const allUsersDB = await knex('online_users').select(['user', 'role']);
    const allUsers = allUsersDB.map((user) => {
      // join user and role
      if (user['role']) {
        return user['role'] + user['user'];
      }
      return user['user'];
    });
    return allUsers;
  }

  static async deleteUser(nick: string): Promise<void> {
    // delete user from db
    await knex('online_users')
      .del()
      .where({ user: nick })
      .catch((e) => log.error('ERROR IN Users.deleteUser', e));
    log.info(`User ${nick} has parted.`);
  }

  static async addUser(nick: string, role: string | null): Promise<void> {
    log.info('ATTEMPTING TO ADD NEW USER ' + nick);
    await knex('online_users')
      .insert({ user: nick, role })
      .catch((e) => {
        //ignore any duplicate users that may be in table
        //example: disconnecting from IRC
        if (e.errno != 1062) log.error('ERROR in Users.addUser', e);
      });
    log.info(`${nick} has come online.`);
  }

  static async updateUser(role: string | null, oldNick: string, newNick?: string): Promise<void> {
    if (role && role === 'KEEP') {
      await knex('online_users')
        .where({ user: oldNick })
        .update({ user: newNick ?? oldNick });
      log.info(`CHANGED NICK ${oldNick} TO ${newNick}`);
    } else {
      await knex('online_users')
        .where({ user: oldNick })
        .update({ role, user: newNick ?? oldNick });
      log.info('UPDATED USER ROLE FOR ' + oldNick);
    }
  }

  static async flushUserTable(): Promise<void> {
    try {
      log.info('ATTEMPTING TO CLEAR USER TABLE ON START');
      const deleted = await knex('online_users').del();
      if (deleted) log.info('DELETED ALL USERS');
    } catch (e) {
      log.warn('UNABLE TO DELETE USERS');
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
