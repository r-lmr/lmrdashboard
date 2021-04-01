import { LogWrapper } from '../utils/logging/LogWrapper';
import knex from './dbConn';

const log = new LogWrapper(module.id);

class InitDatabase {
  static MigrateDatabase() {
    knex.migrate
      .latest({
        directory: __dirname + '/knex_migrations',
      })
      .then(() => {
        log.info('Running database migrations of latest');
      });
  }
}

export { InitDatabase };
