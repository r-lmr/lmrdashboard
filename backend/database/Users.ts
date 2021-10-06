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

  static async addUser(nick: string, role: Role | null): Promise<void> {
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

  static async updateUser(role: 'KEEP' | Role | null, oldNick: string, newNick?: string): Promise<void> {
    if (role === 'KEEP') {
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

  private static getUserRole(nickWithRole: string): Role {
    const first = nickWithRole[0];
    if (first === OP || first === HOP || first === VOICE) {
      return first;
    }
    return NONE;
  }

  private static getNickRoles(nicksWithRoles: string[]): NickRoles {
    const nickRoles = {
      [OP]: new SortedSet<string>(),
      [HOP]: new SortedSet<string>(),
      [VOICE]: new SortedSet<string>(),
      [NONE]: new SortedSet<string>(),
    };

    for (const nickWithRole of nicksWithRoles) {
      const role = this.getUserRole(nickWithRole);
      nickRoles[role].push(nickWithRole);
    }

    return nickRoles;
  }

  /**
   * Returns a list of strings sorted first by role, then alphabetically
   * Role precedence: @, %, +
   * @param nicksWithRoles list of strings of nicks prepended with their role
   * @returns list of strings of nicks prepended with their role but sorted
   */
  static getSortedUsersByRoleAndAlphabetically(nicksWithRoles: string[]): string[] {
    const nickRoles = DatabaseUserUtils.getNickRoles(nicksWithRoles);
    const sortedUsers = Object.values(nickRoles).flatMap(nicks => nicks.toArray());

    if (nicksWithRoles.length !== sortedUsers.length)
      console.warn('Sorting users resulted in different number of users');

    return sortedUsers;
  }
}

export { DatabaseUserUtils };

export type Role = '@' | '%' | '+' | 'NOROLE';
export type NickRoles = Record<Role, SortedSet<string>>;

const OP = '@';
const HOP = '%';
const VOICE = '+';
const NONE = 'NOROLE';
