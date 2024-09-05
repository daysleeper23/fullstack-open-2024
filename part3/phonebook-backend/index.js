const express = require('express')
const app = express()
const jsonData = require('./db.json')

app.use(express.json())

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
  console.log(request)
  
  const body = request.body
  console.log('body', body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'missing information' 
    })
  }

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