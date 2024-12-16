const { REDIS_HOST, REDIS_PORT } = require('../util/config');
const session = require('express-session');
const { RedisStore } = require("connect-redis");
const Redis = require('ioredis');

let redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

// const store = new RedisStore({
//   client: redisClient,
//   prefix: 'sess:',
// });

const sessionMiddleware = session({
  store: new RedisStore({
    client: redisClient
    , prefix: 'sess:',
  }),
  secret: "my-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true for HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  },
});

module.exports = { sessionMiddleware };