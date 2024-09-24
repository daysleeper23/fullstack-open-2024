import { useQuery } from "@apollo/client"
import BookList from "./BookList"
import { ALL_BOOKS } from "../queries/queries"

const Recommendations = ({ user }) => {

  if (!user) return 'You need to login first!'

  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables : {
      author: "all",
      genre: user.favoriteGenre
    }
  })

  if (loading) return 'Loading...'
  if (error) return `Error ${error.message}`

  

  // console.log('user', userData.me)

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Recommendations</h2>
      <p>Books in your favorite genre: <b>{user.favoriteGenre}</b></p>
      <BookList books={data.allBooks} filter={user.favoriteGenre} />
    </div>
  )
}
export default Recommendations