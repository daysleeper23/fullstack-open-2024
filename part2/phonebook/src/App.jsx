import { useState, useEffect } from 'react'
import { getAll, create, update, deletePerson } from './services/persons'

import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newNumber, setNewNumber] = useState('')

  const [newName, setNewName] = useState('')

  const [newSearch, setNewSearch] = useState('')

  const [notification, setNotification] = useState({ type: 'success', message: ''})

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

    const newPerson = persons.find(person => person.name === newName)

    if (newPerson) {      
      if (newPerson.number === newNumber) {
        alert(`${newName} with the number ${newNumber} is already added to phonebook`)
        return 
      }

      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        update(newPerson.id, {...newPerson, number: newNumber})
          .then(response => {
            console.log('update promise fulfilled')
    
            let newPersons = [...persons]
            const index = newPersons.findIndex(person => person.id === response.data.id);
            newPersons[index].number = response.data.number
            
            console.log('new Persons:', newPersons)
            setPersons(newPersons)

            setNotification({type: 'success', message: `Updated ${response.data.name}`})
            setTimeout(() => { 
              setNotification({type: 'success', message: ``})
            }, 2000)
            
              return
            })
          .catch(error => {
            if (error.response) {
              console.log('Error status code:', error.response.status);
              if (error.response.status == 404)
              {
                console.log('found error!')
                setNotification({ type: 'error', message: `Information of ${newName} has been removed from server` })
                setTimeout(() => { 
                  setNotification({type: 'success', message: ``})
                }, 2000)
                return
              }
            } else if (error.request) {
              console.log('No response received:', error.request);
            } else {
              console.log('Error while :', error.message);
            }

            console.log('update fail')
            return
          })

      }
    }
    else {
      console.log('start submitting new entry...')
      const newId = Number(persons.reduce((newId, person) => {
        return person.id > newId ? person.id : newId
      }, 0)) + 1
      
      create({name: newName, number: newNumber, id: newId.toString()})
        .then(response => {
          console.log('create promise fulfilled')

          let newPersons = [...persons]
          newPersons.push({name: response.data.name, number: response.data.number, id: response.data.id})
          
          console.log('new Persons:', newPersons)
          setPersons(newPersons)

          setNotification({ type: 'success', message: `Added ${response.data.name}` })
          setTimeout(() => { 
            setNotification({type: 'success', message: ``})
           }, 2000)
        })  
        .catch(error => {
          console.log('fail')
        })
    }
    

    setNewName('')
    setNewNumber('')
    document.getElementById('name').focus()
  }

  const handleDelete = (e) => {
    const deletingPerson = persons.find(person => person.id == e.target.id)

    if (window.confirm(`Delete ${deletingPerson.name} ?`)) {
      deletePerson(deletingPerson.id)
        .then(response => {
          console.log('delete promise fulfilled')
          
          const newPersons = [...persons]
          const index = persons.findIndex(person => person.id == response.data.id)
          if (index !== -1) {
            newPersons.splice(index, 1);
          }

          console.log('new Persons:', newPersons)
          setPersons(newPersons)
          
          setNotification({ type: 'success', message: `Deleted ${response.data.name}` })
          setTimeout(() => { 
            setNotification({type: 'success', message: ``})
          }, 2000)
        })
        .catch(error => {
          console.log('delete fail')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={notification.type} message={notification.message}/>
      <Filter search={newSearch} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm 
        name={newName} number={newNumber} 
        submitHandler={handleSubmit} nameChangeHandler={handleNameChange} numChangeHandler={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        list={persons} searchTerm={newSearch}
        deleteHandler={handleDelete} />
    </div>
  )
}

export default App