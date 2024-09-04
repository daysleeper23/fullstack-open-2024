import { useState, useEffect } from 'react'
import SearchResult from './components/SearchResult'
import { getAll } from './services/countries'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const allCountries = []

  useEffect(() => {
    console.log('effect')
    getAll()
      .then(response => {
        console.log('promise fulfilled')
        // allCountries = [...response.data]
        setCountries(response.data)
        console.log('number of country:', response.data.length)
      })
  }, [])

  const handleSearchInputChange = (e) => {
    console.log('current search term:', e.target.value)
    setSearchTerm(e.target.value)
  }

  return (
    <div>
        find countries <input value={searchTerm} onChange={handleSearchInputChange} />
        <SearchResult results={countries} searchTerm={searchTerm}/>
    </div>
  )
}

export default App
