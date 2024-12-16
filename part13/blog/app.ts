require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors());

//config baseUrl for the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisMiddleware = require('./middlewares/redisMiddleware');
app.use(redisMiddleware.sessionMiddleware);

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const authRouter = require('./controllers/auth');
const authorRouter = require('./controllers/authors');
const listRouter = require('./controllers/readinglists');

//use the controller router
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/authors', authorRouter);
app.use('/api/readinglists', listRouter);

const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(errorMiddleware.unknownEndpoint);
app.use(errorMiddleware.errorHandler);

export default app;