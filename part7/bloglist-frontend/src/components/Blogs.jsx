import Notification from "./Notification";
import BlogNewForm from "./BlogNewForm";
import BlogItem from "./BlogItem";
import { useSelector } from "react-redux";
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
      {blogs.map((blog) => (
        <BlogItem key={blog.id} blog={blog} />
      ))}
    </>
  );
};
export default Blogs;
