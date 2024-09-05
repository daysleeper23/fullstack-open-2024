require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

//logging configuration
var morgan = require('morgan')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

var logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

//middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(logger)

//generic
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//get info
app.get('/info', (request, response) => {
  const date = new Date()
  Person
    .find({})
    .then(persons => {
      response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
      `)
    })
    .catch(error => {
      return response.status(400).json({ 
        error: error.message
      })
    })
})

//get all persons
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      return response.status(400).json({ 
        error: error.message
      })
    })
})

//get single person
app.get('/api/persons/:id', (request, response, next) => {

  Person
    .findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    // .catch(error => next(error))
})

//create new person
app.post('/api/persons', (request, response, next) => {  
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'missing name or number' 
    })
  }

  // if (persons.findIndex(person => person.name === body.name) !== -1)
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

//update number
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log('update success')
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

//Error Handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})