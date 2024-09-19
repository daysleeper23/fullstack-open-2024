import { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import Blogs from "./components/Blogs";

import blogService from "./services/blogs";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "./reducers/userReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import NavigationMenu from "./components/NavigationMenu";
import { Routes, Route } from "react-router-dom";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ============================================================
  // SECTION: Load User Authentication From Local Storage
  // ============================================================
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(saveUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  // ============================================================
  // SECTION: Data Fetching After User Login
  // ============================================================
  useEffect(() => {
    if (user) {
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      dispatch(initializeBlogs());
    }
  }, [user]);

  // ==============================
  // SECTION: Component UI
  // ==============================
  // if (user)
  //   console.log('user id:', user.id)

  return (
    <div>
      {!user ? (
        <LoginForm />
      ) : (
        <>
          <NavigationMenu />
          <h1>blog app</h1>
          <Routes>
            {/* <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} /> */}
            <Route path="/users" element={<Users />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/" element={<Blogs blogs={blogs} />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
