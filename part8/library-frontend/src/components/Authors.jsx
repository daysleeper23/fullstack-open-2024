import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries/queries"
import { AUTHOR_UPDATE_BORN } from "../queries/mutations"
import { useField } from "../hooks/useField";

const Authors = () => {
  const { reset: resetName, ...name } = useField('text')
  const { reset: resetBorn, ...born } = useField('number')

  const [ updateBornYear ] = useMutation(AUTHOR_UPDATE_BORN, {
    refetchQueries: [ 
      { query: ALL_AUTHORS },
    ],
    onError: (error) => {
      const messages = error.graphQLError.map(e => e.message).join('\n')
      console.log('error:', messages)
    }
  })

  const { loading, error, data } = useQuery(ALL_AUTHORS)

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const updateBorn = (event) => {
    event.preventDefault()
    updateBornYear({ 
      variables: { 
        name: name.value,
        born: Number(born.value) 
      }
    })
    resetName()
    resetBorn()
  }

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={updateBorn}>
        <div>
          Name
          <input required data-testid="author-name" {...name} />
        </div>
        <div>
          Born
          <input required data-testid="author-born" {...born} />
        </div>   
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors
