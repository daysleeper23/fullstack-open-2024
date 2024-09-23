import { useQuery } from "@apollo/client"
import { ALL_BOOKS, GENRES_ALL } from "../queries/queries"
import ButtonGroup from "./ButtonGroup"
import { useState } from "react"
import BookList from "./BookList"

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const { loading: genreLoading, error: genreError, data: genreData } = useQuery(GENRES_ALL)
  const [ selectedGenre, setSelectedGenre ] = useState('all')

  if (loading || genreLoading) return 'Loading...'
  if (error) return `Error ${error.message}`
  if (genreError) return `Error ${genreError.message}`

  // const tableHeadingClass = "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
  // const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Books</h2>
      <div className="space-y-2">
        <h3 className="text-l font-medium">Filter books by genres</h3>
        <ButtonGroup list={genreData.allGenres} onSelectGenre={setSelectedGenre}/>
      </div>
      <BookList books={data.allBooks} filter={selectedGenre} />
    </div>
  )
}

export default Books
