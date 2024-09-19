import Notification from "./Notification";
import BlogNewForm from "./BlogNewForm";
import BlogItem from "./BlogItem";
import { useSelector } from "react-redux";
import { List, Table, TableBody } from "@mui/material";
// import { Link } from "react-router-dom";

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  // const blogMatch = useMatch('/blogs/:id')
  // const blog = blogMatch
  //   ? blogs.find(b => b.id === blogMatch.params.id)
  //   : null

  return (
    <>
      <Notification />
      <BlogNewForm />
      <List>
      {blogs.map((blog) => (
            <BlogItem key={blog.id} blog={blog} />
          ))}
      </List>
          
      
    </>
  );
};
export default Blogs;
