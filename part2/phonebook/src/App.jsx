import { useState } from 'react'

const Item = ({person}) => <p>{person.name}</p>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])

  const [newName, setNewName] = useState('')

  const handleInputChange = (e) => {
    console.log('current string of the input', e.target.value)
    setNewName(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (newName.length == 0)
      return

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    console.log('start submitting...')
    let newPersons = [...persons]
    newPersons.push({name: newName})
    console.log('new Persons:', newPersons)
    setPersons(newPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleInputChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => <Item key={person.name} person={person} />)}
      </div>
    </div>
  )
}

export default App