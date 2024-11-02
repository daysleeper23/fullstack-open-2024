require('dotenv').config();
const express = require('express');
const app = express();

const blogsRouter = require('./controllers/blogs');

//config baseUrl for the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const baseUrl = '/api/blogs';

//use the controller router
app.use(baseUrl, blogsRouter);

//initialize express server with a env variable PORT
const { PORT } = require('./util/config');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});