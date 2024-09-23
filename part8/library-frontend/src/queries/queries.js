import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
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
  query {
    me {
      id
      username
      favoriteGenre
    }
  }
`

export const GENRES_ALL = gql`
  query {
    allGenres
  }
`
