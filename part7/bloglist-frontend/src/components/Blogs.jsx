import Notification from "./Notification";
import BlogNewForm from "./BlogNewForm";
import Blog from "./Blog";

const Blogs = ({ blogs }) => {
  return (
    <>
      <Notification />
      <BlogNewForm />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};
export default Blogs;
