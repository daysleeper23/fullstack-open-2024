import axios from 'axios'
const iconUrl = 'https://openweathermap.org/img/wn/'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_KEY

const getIcon = ( icon ) => {
  return axios.get(`${iconUrl}/${icon}@2x.png`)
}

const getWeather = ( capital ) => {
  return axios.get(`${baseUrl}${capital}&units=metric&appid=${WEATHER_API_KEY}`)
}

export { getIcon, getWeather }