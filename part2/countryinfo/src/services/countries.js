import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getAll = () => {
  return axios.get(`${baseUrl}/all`)
}

// const create = newObject => {
//   return axios.post(baseUrl, newObject)
// }

// const update = (id, newObject) => {
//   return axios.put(`${baseUrl}/${id}`, newObject)
// }

// const deletePerson = (id) => {
//   console.log('deleting', id)
//   return axios.delete(`${baseUrl}/${id}`)
// }

export { getAll }
