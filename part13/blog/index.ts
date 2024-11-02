require('dotenv').config();
require('express-async-errors')

const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors());

//config baseUrl for the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const baseUrl = '/api/blogs';

const blogsRouter = require('./controllers/blogs');

//use the controller router
app.use(baseUrl, blogsRouter);

const middleware = require('./util/middleware');
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

//initialize express server with a env variable PORT
const { PORT } = require('./util/config');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});