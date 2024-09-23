import { useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_BOOKS, GENRES_ALL } from "../queries/queries"

import ButtonGroup from "./ButtonGroup"
import BookList from "./BookList"

const Books = () => {
  const [ selectedGenre, setSelectedGenre ] = useState('all')

  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables : {
      author: "all",
      genre: selectedGenre
    },
    fetchPolicy: "cache-and-network"
  })
  const { loading: genreLoading, error: genreError, data: genreData } = useQuery(GENRES_ALL)

  if (loading || genreLoading) return 'Loading...'
  if (error) return `Error ${error.message}`
  if (genreError) return `Error ${genreError.message}`

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Books</h2>
      <div className="space-y-2">
        <h3 className="text-l font-medium">Filter books by genres</h3>
        <ButtonGroup list={genreData.allGenres} onSelectGenre={setSelectedGenre}/>
      </div>
      <BookList books={data.allBooks} filter="all" />
    </div>
  )
}

export default Books
