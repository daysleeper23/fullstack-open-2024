import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query authorGet{
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query booksGet($author: String!, $genre: String!) {
    allBooks(
      author: $author
      genre: $genre
    ) {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
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
