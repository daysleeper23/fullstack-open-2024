import { useState } from 'react'
import { useField } from '../hooks/useField'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../queries/mutations'
import { ALL_AUTHORS, ALL_BOOKS } from '../queries/queries'
// import { GraphQLError } from 'graphql'

const NewBook = () => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetPublished, ...published } = useField('number')
  const { reset: resetGenre, ...genre } = useField('text')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [ 
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
    ],
    onError: (error) => {
      // const messages = error.graphQLError.map(e => e.message).join('\n')
      console.log('error:', error)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    addBook({ 
      variables: { 
        title: title.value,
        author: author.value,
        published: Number(published.value),
        genres: genres
    }
  })

    resetTitle()
    resetPublished()
    resetAuthor()
    setGenres([])
    resetGenre()
  }

  const addGenre = () => {
    setGenres(genres.concat(genre.value))
    resetGenre()
  }

  return (
    <div>
      <h2>Add new book</h2>
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