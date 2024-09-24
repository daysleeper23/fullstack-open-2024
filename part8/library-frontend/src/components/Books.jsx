import { useQuery, NetworkStatus } from "@apollo/client"
import { useState, useMemo, useEffect } from "react"
import { ALL_BOOKS, GENRES_ALL } from "../queries/queries"

import ButtonGroup from "./ButtonGroup"
import BookList from "./BookList"

const Books = ({ }) => {
  const [ selectedGenre, setSelectedGenre ] = useState('all')
  const [bookCache, setBookCache] = useState([]);

  const { 
    loading, 
    error, 
    data, 
    networkStatus 
  } = useQuery(ALL_BOOKS, {
    variables : {
      author: "all",
      genre: selectedGenre
    },
    notifyOnNetworkStatusChange: true
  })

  const { 
    loading: genreLoading, 
    error: genreError, 
    data: genreData 
  } = useQuery(GENRES_ALL, { fetchPolicy: "cache-first" })

  const isRefetching = networkStatus === NetworkStatus.refetch;
  useEffect(() => {
    if (data && !loading && !isRefetching) {
      setBookCache(data.allBooks); // Update cache only when new data is loaded
    }
  }, [data, loading, isRefetching]);

  const renderError = (message) => (
    <div className="text-red-500">
      <p>Error: {message}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  if (genreLoading || genreError) {
    return <p>Loading genres...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Books</h2>
      <div className="space-y-2">
        <h3 className="text-l font-medium">Filter books by genres</h3>
        <ButtonGroup list={genreData.allGenres} onSelectGenre={setSelectedGenre}/>
      </div>
      {isRefetching && <p>Loading new books...</p>}
      <BookList books={bookCache} filter="all" />
      {error && !isRefetching && renderError(error.message)}
    </div>
  )
}

export default Books
