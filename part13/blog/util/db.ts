const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    }
  },
  logging: false,
});

const connectToDatabase = async () => {
  //try-catch blog to connect to the database
  try {
    await sequelize.authenticate();
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