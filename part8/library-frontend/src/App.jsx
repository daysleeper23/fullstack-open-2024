import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import NavigationMenu from "./components/NavigationMenu";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <div>
      {/* <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div> */}
      <NavigationMenu />
      <Routes>
        <Route path="/authors" element={<Authors />}></Route>
        <Route path="/books" element={<Books />}></Route>
        <Route path="/add-book" element={<NewBook />}></Route>
        <Route path="/" element={<Authors />}></Route>
      </Routes>

      {/* <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} /> */}
    </div>
  );
};

export default App;
