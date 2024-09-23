const BookList = ({ books, filter }) => {
  const tableHeadingClass = "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
  const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"

  return (
    <table>
      <tbody className="divide-y divide-gray-200">
        <tr>
          <th className={tableHeadingClass}>title</th>
          <th className={tableHeadingClass}>author</th>
          <th className={tableHeadingClass}>published</th>
          <th className={tableHeadingClass}>genre</th>
        </tr>
        {books
          .filter(book => filter === "all" || book.genres.includes(filter))
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
  )
}
export default BookList