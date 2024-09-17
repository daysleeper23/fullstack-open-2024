import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log('response:', response.data)
  return response.data
}

export const create = async (content) => {
  if (content.length < 5) {
    console.log('length smaller than 5')
    throw new Error('Data validation failed: The length of the string must be greater than 5.')
  }

  const newAnecdote = {
    id: getId(),
    content: content,
    votes: 0
  }

  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

export const update = async (newAnecdote) => {
  const updAnecdote = { ...newAnecdote, votes: newAnecdote.votes + 1 }
  // console.log('upd:', updAnecdote)
  const response = await axios.put(`${baseUrl}/${newAnecdote.id}`, updAnecdote)
  return response.data
}

export default { getAll, create, update }