import { useState } from 'react'
import { useField } from '../hooks/useField'

const NewBook = () => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetPublished, ...published } = useField('number')
  const { reset: resetGenre, ...genre } = useField('text')
  const [genres, setGenres] = useState([])

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    resetTitle()
    resetPublished()
    resetAuthor()
    setGenres([])
    resetGenre()
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    resetGenre()
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input required data-testid="title" {...title} />
        </div>
        <div>
          author
          <input required data-testid="author" {...author} />
        </div>
        <div>
          published
          <input required data-testid="published" {...published} />
        </div>
        <div>
          <input data-testid="genre" {...genre} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook