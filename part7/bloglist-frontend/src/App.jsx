import { useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogNewForm from "./components/BlogNewForm";
import Notification from "./components/Notification";

import blogService from "./services/blogs";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "./reducers/userReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import UserInfo from "./components/UserInfo";

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
          <h1>blogs</h1>
          <Notification />
          <UserInfo />
          <BlogNewForm />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
