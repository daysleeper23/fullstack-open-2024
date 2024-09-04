import { useState } from "react"
import SingleCountryInfo from "./SingleCountryInfo"

const SearchResultEntry = ({ country }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = (e) => {
    const newStatus = !showDetail
    setShowDetail(newStatus)
  }

  return (
    <div>
      {country.name.common}
      <button onClick={toggleShowDetail}>
        { !showDetail ? 'show' : 'hide'}
      </button>
      { showDetail ? <SingleCountryInfo country={country} /> : <></>}
    </div>
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
            countries.map(country => <SearchResultEntry key={country.name.common} country={country} />)
          }
        </>
      )
  }
}
export default SearchResult