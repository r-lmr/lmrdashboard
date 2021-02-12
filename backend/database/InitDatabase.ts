import knex from './dbConn';

class InitDatabase {
  static MigrateDatabase() {
    knex.migrate
      .latest({
        directory: __dirname + '/knex_migrations',
      })
      .then(() => {
        console.log('Running database migrations of latest');
      });
  }
}

export { InitDatabase };
