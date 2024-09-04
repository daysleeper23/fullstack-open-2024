const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleSearchChange}/>
    </div>
  )
}

export default Filter