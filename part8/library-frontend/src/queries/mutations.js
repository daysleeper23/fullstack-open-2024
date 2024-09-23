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
      author {
        id
        name
      }
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
