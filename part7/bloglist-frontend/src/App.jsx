import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useMatch } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import Blogs from "./components/Blogs";
import NavigationMenu from "./components/NavigationMenu";
import User from "./components/User";
import Blog from "./components/Blog";

import blogService from "./services/blogs";

import { saveAuth } from "./reducers/authReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers } from "./reducers/userReducer";

const App = () => {
  const auth = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  // ============================================================
  // SECTION: Load User Authentication From Local Storage
  // ============================================================
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      console.log("load auth data from localStorage");
      const auth = JSON.parse(loggedUserJSON);
      dispatch(saveAuth(auth));
      blogService.setToken(auth.token);
    }
  }, []);

  // ============================================================
  // SECTION: Data Fetching After User Login
  // ============================================================
  useEffect(() => {
    if (auth) {
      console.log("auth data is valid");
      blogService.setToken(auth.token);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(auth));
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
    }
  }, [auth]);

  // ============================================================
  // SECTION: Matching URLs that contain IDs
  // ============================================================
  const userMatch = useMatch("/users/:id");
  const user = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const blog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

  // ============================================================
  // SECTION: Component UI
  // ============================================================

  return (
    <div>
      {!auth ? (
        <LoginForm />
      ) : (
        <>
          <NavigationMenu />
          <h1>blog app</h1>
          <Routes>
            <Route path="/blogs/:id" element={<Blog blog={blog} />} />
            <Route path="/users/:id" element={<User user={user} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<Blogs />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
