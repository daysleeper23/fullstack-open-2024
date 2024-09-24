import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import NavigationMenu from "./components/NavigationMenu";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Recommendations from "./components/Recommendation";
import { useQuery, useSubscription } from "@apollo/client";
import { USER_CURRENT, ALL_BOOKS } from "./queries/queries";
import { BOOK_ADDED } from "./queries/subscriptions";


const App = () => {
  /*
    HELPER: MANUALLY UPDATE CACHE FOR ALL BOOKS QUERIES
  */
  const queryObject = (genre) => {
    return {
      query: ALL_BOOKS,
      variables: {
        author: "all",
        genre: genre
      }
    }
  }

  const cacheUpdate = (client, genre, newBook) => {
    client.cache.updateQuery(
      queryObject(genre),
      ({ allBooks }) => {
        if (allBooks) {
          return {
            allBooks: allBooks.concat(newBook),
          }
        }
      }
    )
  }

  /*
    SUBSCRIPTION: NEW BOOK ADDED
  */
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      console.log('new Book: ', addedBook)
      
      //update cache for normal genres
      addedBook.genres.forEach(genre => {
        if ( client.cache.readQuery( queryObject(genre) ) ) {
          console.log('update cache for', genre)
          cacheUpdate(client, genre, addedBook)
        }
      })

      //update cache for "all" genre
      if ( client.cache.readQuery( queryObject("all") ) ) {
        console.log('update cache for all')
        cacheUpdate(client, "all", addedBook)
      }
    }
  })

  /*
    QUERY: BOOKS
  */
  const { loading: bookLoading, error: bookError, data: bookData } = useQuery(ALL_BOOKS, {
    variables : {
      author: "all",
      genre: "all"
    }
  })

  /*
    QUERY: CURRENT USER
  */
  const { loading, error, data } = useQuery(USER_CURRENT)
  if (loading) return 'Loading...'
  if (error) return `Error ${error.message}`

  /*
    COMPONENT UI
  */
  return (  
    <div className="container mx-auto px-4">
      <NavigationMenu />
      <Routes>
        <Route path="/authors" element={<Authors />}></Route>
        <Route path="/books" element={<Books />}></Route>
        <Route path="/add-book" element={<NewBook />}></Route>
        <Route path="/recommendations" element={<Recommendations user={data.me}/>}></Route>
        <Route path="/login" element={<Login user={data.me}/>}></Route>
        <Route path="/" element={<Authors />}></Route>
      </Routes>
    </div>
  );
};

export default App;
