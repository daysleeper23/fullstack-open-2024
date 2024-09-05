import axios from 'axios'
const baseUrl = 'https://fullstack-open-2024-phonebook-backend.onrender.com/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const deletePerson = (id) => {
  console.log('deleting', id)
  return axios.delete(`${baseUrl}/${id}`)
}

export { getAll, create, update, deletePerson }
