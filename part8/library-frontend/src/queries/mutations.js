import { gql } from '@apollo/client'
import { AUTHOR_DETAILS, BOOK_DETAILS } from './queries'

export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const AUTHOR_UPDATE_BORN = gql`
  mutation authorUpdateBorn($name: String!, $born: Int!) {
    authorSetBorn(
      name: $name
      setBornTo: $born
    ) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
  mutation userLogin($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`
