const SingleCountryInfo = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map(lang => <li>{lang}</li>)}
      </ul>
      <img src={country.flags.png ? country.flags.png : country.flags.svg} ></img>
    </>
  )
}
export default SingleCountryInfo