import { gql } from '@apollo/client'

/*
  FRAGMENTS
*/

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
  }
`

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      ...AuthorDetails
    }
    published
    genres
  }
  ${AUTHOR_DETAILS}
`

/*
  QUERY
*/

export const ALL_AUTHORS = gql`
  query authorGet{
    allAuthors {
      ...AuthorDetails
      bookCount
    }
  }
  ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
  query booksGet($author: String, $genre: String) {
    allBooks(
      author: $author
      genre: $genre
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const USER_CURRENT = gql`
  query userCurrent{
    me {
      id
      username
      favoriteGenre
    }
  }
`

export const GENRES_ALL = gql`
  query genreGet{
    allGenres
  }
`