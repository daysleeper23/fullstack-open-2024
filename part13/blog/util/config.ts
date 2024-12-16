require('dotenv').config()

module.exports = {
  SECRET: process.env.SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
}
