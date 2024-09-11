import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  return token
}

const getAll = async () => {
  console.log('get blogs')
  const response = await axios.get(baseUrl, { headers: { 'Authorization': token }})
  return response.data
}

export default { getAll, setToken, getToken }