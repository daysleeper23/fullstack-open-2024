import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries/queries"
import { AUTHOR_UPDATE_BORN } from "../queries/mutations"
import { useField } from "../hooks/useField";
import Button from "./Button";
import InputLabeled from "./InputLabeled";
import Select from "./Select";

const Authors = () => {
  const { reset: resetName, ...name } = useField('select')
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
    console.log('update author:', name.value)
    updateBornYear({ 
      variables: { 
        name: name.value,
        born: Number(born.value) 
      }
    })
    resetName()
    resetBorn()
  }
  const tableHeadingClass = "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
  const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Authors</h2>
        <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th className={tableHeadingClass}>NAME</th>
              <th className={tableHeadingClass}>BORN</th>
              <th className={tableHeadingClass}>BOOKS</th>
            </tr>
            {data.allAuthors.map((a) => (
              <tr key={a.name}>
                <td className={tableCellClass}>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-2xl font-bold py-4">Set birthyear</h3>
        <form className="space-y-4" onSubmit={updateBorn}>
          <Select required label="Name" data={data.allAuthors} field={name} />
          <InputLabeled required label="Born" placeholder="Born" field={born}/>
          <Button type="submit" variant="solid">Update author</Button>
        </form>
      </div>
    </div>
  )
}

export default Authors
