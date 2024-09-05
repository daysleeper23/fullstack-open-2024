const express = require('express')
const app = express()
const jsonData = require('./db.json')
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

let persons = jsonData.persons

//generic
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//get info
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

//get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//get single person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).send('Sorry, person not found')
  }
})

//generate ID for new person
const generateId = () => {
  const newId = Math.floor(Math.random() * 10000) + 1

  while (persons.findIndex(person => person.id === newId) !== -1)
    newId = Math.floor(Math.random() * 10000) + 1
  
  return newId.toString()
}

//create new person
app.post('/api/persons', (request, response) => {  
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'missing name or number' 
    })
  }

  if (persons.findIndex(person => person.name === body.name) !== -1)
    return response.status(400).json({ 
      error: 'name must be unique' 
    })

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

//delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id.toString()
  const beforeDeleteCount = persons.length
  persons = persons.filter(person => person.id !== id)
  
  if (persons.length < beforeDeleteCount)
    response.status(204).end()
  else
    response.status(404).send('Sorry, person not found')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})