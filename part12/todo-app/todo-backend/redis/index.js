const redis = require('redis')
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config')

let getAsync;
//  = async (key) => {
//   try {
//     const value = await client.get(key)
//     return value
//   } catch (error) {
//     console.log('error getting ', key, error)
//   }
// }

let setAsync;
//  = async (key, value) => {
//   try {
//     await client.set(key, value)
//   } catch (error) {
//     console.log('error setting ', key, error)
//   }
// }

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled')
    return null
  }
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else {
  const client = redis.createClient({
    url: REDIS_URL
  })
    
  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)    
}

// onst { getAsync, setAsync } = require('./redis');


module.exports = {
  getAsync,
  setAsync
}