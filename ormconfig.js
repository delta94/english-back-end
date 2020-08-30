module.exports = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    insecureAuth: true,
    charset: 'utf8mb4',
    logger: 'simple-console',
    logging: ['error', 'schema', 'warn'], // , 'query'],
    maxQueryExecutionTime: 1000,
    cache: true,
    synchronize: false, // DO NOT TURN THIS BACK ON - Must do Migrations from now on
    dropSchema: false,
    entities: ['dist/entities/*.js', 'dist/modules/*/entities/*.js'],
    subscribers: ['dist/subscribers/*.js', 'dist/modules/*/subscribers/*.js'],
    migrationsTableName: 'migration_table',
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
  