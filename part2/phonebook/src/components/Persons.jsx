const Item = ({ person }) => {
  return (
    <tr>
      <td>
        <p>{person.name}</p>
      </td>
      <td>
        <p>{person.number}</p>
      </td>
    </tr>
  )
}

const Persons = ({ list, searchTerm }) => {
  return (
    <table>
      <tbody>
        {
          list.filter(
            person => person.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(person => <Item key={person.id} person={person} />)
        }
      </tbody>
    </table>
  )
}
export default Persons