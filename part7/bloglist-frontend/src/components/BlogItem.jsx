import PropTypes from "prop-types";

import { Link } from "react-router-dom";

const BlogItem = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div data-testid="blog-item" style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}> {blog.title} {blog.author} </Link>
    </div>
  );
};

BlogItem.propTypes = {
  blog: PropTypes.object.isRequired,
};
export default BlogItem;
