import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, updateBlog } from "../reducers/blogReducer";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLikeClick = async () => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    dispatch(updateBlog(updatedBlog));
  };

  const handleRemoveClick = async () => {
    dispatch(deleteBlog(blog.id));
  };

  return (
    <div data-testid="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button data-testid="showButton" onClick={() => setShow(!show)}>
        {show ? "hide" : "show"}
      </button>
      {show ? (
        <div data-testid="toggable">
          <div data-testid="url">{blog.url}</div>
          <div data-testid="likes">
            likes {blog.likes}
            <button
              data-testid="likeButton"
              value={blog.id}
              onClick={handleLikeClick}
            >
              like
            </button>
          </div>
          <div data-testid="name">{blog.user?.name || "Unknown Creator"}</div>
          {user.username === blog.user?.username ? (
            <button
              data-testid="removeButton"
              value={blog.id}
              onClick={handleRemoveClick}
            >
              remove
            </button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};
export default Blog;
