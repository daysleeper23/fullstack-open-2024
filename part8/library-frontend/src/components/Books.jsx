import { useQuery } from "@apollo/client"
import { ALL_BOOKS, GENRES_ALL } from "../queries/queries"
import ButtonGroup from "./ButtonGroup"
import { useState } from "react"

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const { loading: genreLoading, error: genreError, data: genreData } = useQuery(GENRES_ALL)
  const [ selectedGenre, setSelectedGenre ] = useState('all')

  if (loading || genreLoading) return 'Loading...'
  if (error) return `Error ${error.message}`
  if (genreError) return `Error ${genreError.message}`

  const tableHeadingClass = "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
  const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Books</h2>
      <div className="space-y-2">
        <h3 className="text-l font-medium">Filter books by genres</h3>
        <ButtonGroup list={genreData.allGenres} onSelectGenre={setSelectedGenre}/>
      </div>
      <table>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <th className={tableHeadingClass}>TITLE</th>
            <th className={tableHeadingClass}>author</th>
            <th className={tableHeadingClass}>published</th>
            <th className={tableHeadingClass}>genre</th>
          </tr>
          {data.allBooks
            .filter(book => selectedGenre === "all" || book.genres.includes(selectedGenre))
            .map((a) => (
              <tr key={a.title}>
                <td className={tableCellClass}>{a.title}</td>
                <td className={tableCellClass}>{a.author.name}</td>
                <td className={tableCellClass}>{a.published}</td>
                <td className={tableCellClass}>{a.genres.join(' / ')}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Books
