const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  logger.info('Response status:', response)
  // logger.info('Response body:', response.body)
  next()
}


const unknownEndpoint = (_request, response) => {
  response.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }


  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }