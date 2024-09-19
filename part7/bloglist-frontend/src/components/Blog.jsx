import { useDispatch } from "react-redux";
import { updateBlog, addComment } from "../reducers/blogReducer";
import { useField } from "../hooks/useField";

const Blog = ({ blog }) => {
  // console.log('navigate to blog info page', blog)
  const { reset: resetComment, ...comment } = useField("text");
  const dispatch = useDispatch();

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

  const handleComment = async (e) => {
    e.preventDefault();
    // console.log('add comment', comment.value, blog.id)
    dispatch(addComment(comment.value, blog.id));
    resetComment();
  };

  return (
    <>
      {!blog ? (
        <p>...loading blog</p>
      ) : (
        <>
          {blog?.title ? <h1>{blog.title}</h1> : <h1>Unnamed blog</h1>}
          <div data-testid="url">
            <a href={blog.url}>{blog.url}</a>
          </div>
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
          <div data-testid="addedby">added by {blog.user.name}</div>
          <h2>comments</h2>
          <form onSubmit={handleComment}>
            <div>
              <input required data-testid="comment" {...comment} />
              <button data-testid="comment" type="submit">
                add comment
              </button>
            </div>
          </form>

          {blog?.comments ? (
            <ul>
              {blog.comments.map((c) => (
                <li key={c.content}>{c.content}</li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
};
export default Blog;
