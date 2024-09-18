import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    onReset
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // ...
  useEffect(() => {
    async function getResources() {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    }

    // console.log('resources:', resources)
    if (resources.length === 0)
      getResources()
  }, [])

  const create = async (resource) => {
    // ...
    const newObject = {
      id: Math.round(Math.random() * 100000),
      ...resource
    }
    try {
      const response = await axios.post(baseUrl, newObject)
      const savedObject = response.data
      setResources(resources.concat(savedObject))
    }
    catch (error) {

    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const { onReset: resetContent, ...content } = useField('text')
  const { onReset: resetName, ...name } = useField('text')
  const { onReset: resetNumber, ...number } = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    resetContent()
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
    resetName()
    resetNumber()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App