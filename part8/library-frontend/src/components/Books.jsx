import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries/queries"

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (loading) return 'Loading...'
  if (error) return `Error ${error.message}`

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
