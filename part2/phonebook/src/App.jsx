import { useState, useEffect } from 'react'
import axios from 'axios'
import { getAll, create, update} from './services/persons'

import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newNumber, setNewNumber] = useState('')

  const [newName, setNewName] = useState('')

  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

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
    create({name: newName, number: newNumber, id: persons.length + 1})
      .then(response => {
        console.log('create promise fulfilled')
        newPersons.push({name: newName, number: newNumber, id: (persons.length + 1).toString()})
        console.log('new Persons:', newPersons)
        setPersons(newPersons)
      })

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