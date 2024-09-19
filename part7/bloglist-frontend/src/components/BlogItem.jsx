import PropTypes from "prop-types";

import { ListItem, Divider, ListItemButton } from "@mui/material";

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
    <>
    <ListItem>
      {/* <ListItemButton component="Link" href={`/blogs/${blog.id}`}> */}
        {/* <ListItemText primary={blog.title + blog.author} /> */}
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      {/* </ListItemButton> */}
    </ListItem>
    <Divider />
    </>
  );
};

BlogItem.propTypes = {
  blog: PropTypes.object.isRequired,
};
export default BlogItem;
