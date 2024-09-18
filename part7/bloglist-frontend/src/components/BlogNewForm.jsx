import { useState } from "react";
import { useDispatch } from "react-redux";
import { useField } from "../hooks/useField";
import { createBlog } from "../reducers/blogReducer";

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
        <button onClick={() => setDisplay(true)}>create new blog</button>
      ) : (
        <>
          <h1>create new</h1>
          <form onSubmit={handleSubmit}>
            <div>
              title <input required data-testid="title" {...title} />
            </div>
            <div>
              author <input required data-testid="author" {...author} />
            </div>
            <div>
              url <input required data-testid="url" {...url} />
            </div>
            <button data-testid="create" type="submit">
              create
            </button>
          </form>
          <button onClick={() => setDisplay(false)}>cancel</button>
        </>
      )}
    </>
  );
};
export default BlogNewForm;
