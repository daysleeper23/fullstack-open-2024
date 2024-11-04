const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('./config');
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    }
  },
  logging: false,
});

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  console.log('start migrating-------------------');
  
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig: any) => mig.name),
  });
};

const connectToDatabase = async () => {
  //try-catch blog to connect to the database
  try {
    await sequelize.authenticate();
    await runMigrations();

    console.log('Connected to database:', process.env.DATABASE_URL);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Unable to connect to the database:', error);
    } else {
      console.error('An unknown error occurred');
    }
    return process.exit(1);
  }

  return null;
}
module.exports = { sequelize, connectToDatabase };