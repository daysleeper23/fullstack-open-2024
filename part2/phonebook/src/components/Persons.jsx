const Item = ({ person, deleteHandler }) => {
  return (
    <tr>
      <td>
        <p>{person.name}</p>
      </td>
      <td>
        <p>{person.number}</p>
      </td>
      <td>
        <button id={person.id} onClick={deleteHandler}>
          delete
        </button>
      </td>
    </tr>
  )
}

const Persons = ({ list, searchTerm, deleteHandler }) => {
  return (
    <table>
      <tbody>
        {
          list.filter(
            person => person.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(person => <Item key={person.id} person={person} deleteHandler={deleteHandler} />)
        }
      </tbody>
    </table>
  )
}
export default Persons