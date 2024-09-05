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
app.use(express.json())
app.use(express.static('dist'))
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
app.get('/api/persons/:id', (request, response) => {

  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      return response.status(404).send('Sorry, person not found')
    })
})

//create new person
app.post('/api/persons', (request, response) => {  
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
    .catch(error => {
      return response.status(400).json({
        error: error.message
      })
    })
})

//delete person
// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id.toString()
//   const beforeDeleteCount = persons.length
//   persons = persons.filter(person => person.id !== id)
  
//   if (persons.length < beforeDeleteCount)
//     response.status(204).end()
//   else
//     response.status(404).send('Sorry, person not found')
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})