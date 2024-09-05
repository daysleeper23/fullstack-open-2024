const express = require('express')
const app = express()
const jsonData = require('./db.json')

let persons = jsonData.persons

//generic
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//info
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

//all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//single person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).send('Sorry, person not found')
  }
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