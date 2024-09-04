import { useState, useEffect } from "react"
import { getWeather } from '../services/weather'

import WeatherInfo from "./WeatherInfo"

const SingleCountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({ weather: ''})

  useEffect(() => {
    console.log('weather effect for', country.capital[0])
    getWeather(country.capital[0])
      .then(response => {
        console.log('weather promise fulfilled')
        setWeather(response.data)
        console.log('weather data', response.data)
      })
  }, [])

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png ? country.flags.png : country.flags.svg} ></img>
      {weather.weather ? <WeatherInfo info={weather} /> : <></>}
    </>
  )
}
export default SingleCountryInfo