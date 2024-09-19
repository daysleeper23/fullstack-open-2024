import { useState } from "react";
import { useDispatch } from "react-redux";
import { useField } from "../hooks/useField";
import { createBlog } from "../reducers/blogReducer";
import { Button, TextField, Table, TableBody, TableCell, TableRow } from "@mui/material";

const BlogNewForm = () => {
  const { reset: resetTitle, ...title } = useField("text");
  const { reset: resetAuthor, ...author } = useField("text");
  const { reset: resetUrl, ...url } = useField("text");

  const [display, setDisplay] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
      likes: 0,
    };
    // console.log(newBlog);
    dispatch(createBlog(newBlog));
    resetAuthor();
    resetTitle();
    resetUrl();
  };

  return (
    <>
      {!display ? (
        <Button variant='contained' onClick={() => setDisplay(true)}>create new blog</Button>
      ) : (
        <>
          <h2>Create new blog</h2>
          <form onSubmit={handleSubmit}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell><TextField id="outlined-basic" label="Required" required data-testid="title" {...title} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Author</TableCell>
                  <TableCell><TextField id="outlined-basic" label="Required" required data-testid="author" {...author} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell><TextField id="outlined-basic" label="Required" required data-testid="url" {...url} /></TableCell>
                </TableRow>
                
              </TableBody>
            </Table>
            <div>
              <Button data-testid="create" type="submit" variant='contained'>
                Create
              </Button>
              <Button onClick={() => setDisplay(false)}>Cancel</Button>
            </div>
          </form>
        </>
      )}
    </>
  );
};
export default BlogNewForm;
