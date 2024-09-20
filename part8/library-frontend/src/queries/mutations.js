import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      author
      published
      genres
    }
  }
`

export const AUTHOR_UPDATE_BORN = gql`
  mutation authorUpdateBorn($name: String!, $born: Int!) {
    authorSetBorn(
      name: $name
      setBornTo: $born
    ) {
      id
      name
      born
    }
  }
`
