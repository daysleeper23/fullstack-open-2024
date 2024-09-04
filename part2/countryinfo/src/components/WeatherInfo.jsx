const WeatherInfo = ({ info }) => {
  console.log('weather info:', info)
  return (
    <div>
      <h2>Weather in {info.name}</h2>
      <p>temperature {info.main.temp} Celsius</p>
      {info ? <img src={`https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`}></img> : <></>}
      <p>wind {info.wind.speed} m/s</p>
    </div>
  )

}
export default WeatherInfo