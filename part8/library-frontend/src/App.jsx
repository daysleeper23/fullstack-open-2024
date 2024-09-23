import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import NavigationMenu from "./components/NavigationMenu";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Recommendations from "./components/Recommendation";
import { useQuery } from "@apollo/client";
import { USER_CURRENT } from "./queries/queries";


const App = () => {
  const { loading, error, data } = useQuery(USER_CURRENT)
  if (loading) return 'Loading...'
  if (error) return `Error ${error.message}`

  return (  
    <div className="container mx-auto px-4">
      <NavigationMenu />
      <Routes>
        <Route path="/authors" element={<Authors />}></Route>
        <Route path="/books" element={<Books />}></Route>
        <Route path="/add-book" element={<NewBook />}></Route>
        <Route path="/recommendations" element={<Recommendations user={data.me}/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Authors />}></Route>
      </Routes>
    </div>
  );
};

export default App;
