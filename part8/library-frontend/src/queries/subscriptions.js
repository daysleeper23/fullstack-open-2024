import { gql } from "@apollo/client"
import { BOOK_DETAILS } from "./queries"

export const BOOK_ADDED = gql`
  subscription bookAddOne{
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`