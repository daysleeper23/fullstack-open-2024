import { useState } from 'react'
import { useField } from '../hooks/useField'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../queries/mutations'
import { ALL_AUTHORS, ALL_BOOKS, GENRES_ALL } from '../queries/queries'
import InputLabeled from './InputLabeled'
import Button from './Button'
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
      { query: GENRES_ALL }
    ],
    onError: (error) => {
      // const messages = error.graphQLError.map(e => e.message).join('\n')
      console.log('error:', error)
    },
    // update: (cache, response) => {
    //   cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    //     return {
    //       allBooks: allBooks.concat(response.data.addBook)
    //     }
    //   })
    // }
  })

  const submit = async (event) => {
    event.preventDefault()

    // console.log('add book...', title.value, author.value, published.value, genres)
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

  const addGenre = (e) => {
    e.preventDefault()
    setGenres(genres.concat(genre.value))
    resetGenre()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Add new book</h2>
      <form className="space-y-4" >
        <InputLabeled required label="Title" field={title} />
        <InputLabeled required label="Author" field={author} />
        <InputLabeled required label="Published" field={published} />
        <div className="space-y-2">
          <InputLabeled label="Genres" placeholder="E.g. refactoring, design" field={genre} />
          <p className="text-sm font-medium">{genres.join(' ')}</p>
          <Button onClick={addGenre} variant="outline">Add genre</Button>
        </div>
        
        <Button type="submit" onClick={submit} variant="solid">Create new book</Button>
      </form>
    </div>
  )
}

export default NewBook