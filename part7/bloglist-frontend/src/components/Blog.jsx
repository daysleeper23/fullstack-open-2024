import { useDispatch } from "react-redux";
import { updateBlog, deleteBlog } from "../reducers/blogReducer";

const Blog = ({ blog }) => {
  
  console.log('navigate to blog info page', blog)
  const dispatch = useDispatch()

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
    <>
      {!blog 
        ? <p>...loading blog</p>
        : <>
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
            <div data-testid="addedby">
              added by {blog.user.name}
            </div>
            <h2>comments</h2>
          
            {blog?.comments 
              ? <ul>
                  {blog.comments.map(c => <li>{c.content}</li>)}
                </ul>
              : ''}
          </> 
      }
    </>
  )
};
export default Blog;
