require('dotenv').config();
require('express-async-errors')

const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors());

//config baseUrl for the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorRouter = require('./controllers/authors');

//use the controller router
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorRouter);

const middleware = require('./util/middleware');
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;