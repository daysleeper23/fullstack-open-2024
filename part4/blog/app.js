const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(middleware.tokenExtractor)

const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')

const logger = require('./utils/logger')

//logging configuration
var morgan = require('morgan')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

var loggerMorgan = morgan(':method :url :body --- :status - :response-time ms - :res[content-length]')

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('connected to MongoDB')
  } catch (error) {
    logger.error('error connecting to MongoDB', error.message)
  }
}
connectMongoDB()

app.use(cors())
app.use(express.json())
app.use(loggerMorgan)
// app.use(middleware.requestLogger)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app