import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import NavigationMenu from "./components/NavigationMenu";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Recommendations from "./components/Recommendation";

const App = () => {
  return (  
    <div className="container mx-auto px-4">
      <NavigationMenu />
      <Routes>
        <Route path="/authors" element={<Authors />}></Route>
        <Route path="/books" element={<Books />}></Route>
        <Route path="/add-book" element={<NewBook />}></Route>
        <Route path="/recommendations" element={<Recommendations />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Authors />}></Route>
      </Routes>
    </div>
  );
};

export default App;
