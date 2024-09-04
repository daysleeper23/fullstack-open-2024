import { useState } from 'react'

const Item = ({person}) => {
  return (
    <tr>
      <td>
        <p>{person.name}</p>
      </td>
      <td>
        <p>{person.number}</p>
      </td>
    </tr>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { 
      name: 'Arto Hellas',
      number: '0401234567'  
     }
  ])

  const [newNumber, setNewNumber] = useState('')

  const [newName, setNewName] = useState('')

  const handleNameChange = (e) => {
    console.log('current string of the name input', e.target.value)
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    console.log('current string of the number input', e.target.value)
    setNewNumber(e.target.value)
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
    newPersons.push({name: newName, number: newNumber})
    console.log('new Persons:', newPersons)
    setPersons(newPersons)

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <table>
        {persons.map(person => <Item key={person.name} person={person} />)}
      </table>
    </div>
  )
}

export default App