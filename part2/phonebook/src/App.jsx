import { useState } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])


  const [newNumber, setNewNumber] = useState('')

  const [newName, setNewName] = useState('')

  const [newSearch, setNewSearch] = useState('')

  const handleNameChange = (e) => {
    console.log('current string of the name input', e.target.value)
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    console.log('current string of the number input', e.target.value)
    setNewNumber(e.target.value)
  }

  const handleSearchChange = (e) => {
    console.log('current string of the search input', e.target.value)
    setNewSearch(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (newName.length == 0 || newNumber.length == 0)
      return

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    console.log('start submitting...')
    let newPersons = [...persons]
    newPersons.push({name: newName, number: newNumber, id: persons.length + 1})
    console.log('new Persons:', newPersons)
    setPersons(newPersons)

    setNewName('')
    setNewNumber('')
    document.getElementById('name').focus()
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={newSearch} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm 
        name={newName} number={newNumber} 
        submitHandler={handleSubmit} nameChangeHandler={handleNameChange} numChangeHandler={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons list={persons} searchTerm={newSearch} />
    </div>
  )
}

export default App