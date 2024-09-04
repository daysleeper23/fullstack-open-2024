import SingleCountryInfo from "./SingleCountryInfo"

const SearchResultEntry = ({ name }) => {
  return (
    <div>{name}</div>
  )
}

const SearchResult = ({ searchTerm, results }) => {
  if (searchTerm == '')
    return <></>

  const countries = results.filter(result => result.name.common.toLowerCase().includes(searchTerm.toLowerCase()))  
  
  if (countries.length > 10)
    return <p>Too many matches, specify another filter</p>
  else {
    if (countries.length === 1)
      return <SingleCountryInfo country={countries[0]} />
    else
      return (
        <>
          {
            countries.map(country => <SearchResultEntry key={country.name.common} name={country.name.common} />)
          }
        </>
      )
  }
}
export default SearchResult