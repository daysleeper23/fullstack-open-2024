import { useQuery } from "@apollo/client"
import BookList from "./BookList"
import { ALL_BOOKS, USER_CURRENT } from "../queries/queries"

const Recommendations = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const { loading: userLoading, error: userError, data: userData } = useQuery(USER_CURRENT)

  if (loading || userLoading ) return 'Loading...'
  if (error) return `Error ${error.message}`
  if (userError) return `Error ${userError.message}`

  // console.log('user', userData.me)

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Recommendations</h2>
      <p>Books in your favorite genre: <b>{userData.me.favoriteGenre}</b></p>
      <BookList books={data.allBooks} filter={userData.me.favoriteGenre} />
    </div>
  )
}
export default Recommendations