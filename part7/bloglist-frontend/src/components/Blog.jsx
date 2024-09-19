import { useDispatch } from "react-redux";
import { updateBlog, addComment } from "../reducers/blogReducer";
import { useField } from "../hooks/useField";

import { Button, Input } from '@headlessui/react'

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
            <Button
              data-testid="likeButton"
              value={blog.id}
              onClick={handleLikeClick}
              className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >
              like
            </Button>
          </div>
          <div data-testid="addedby">added by {blog.user.name}</div>
          <h2>comments</h2>
          <form onSubmit={handleComment}>
            <div>
              <Input required data-testid="comment" {...comment} />
              {/* <button data-testid="comment" type="submit" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                
              </button> */}
              <Button data-testid ="comment" type="submit" className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                add comment
              </Button>
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
