import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLikeClick, onRemoveClick, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [show, setShow] = useState(false)

  const handleLikeClick = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    // console.log('updated blog:', updatedBlog)
    await onLikeClick(updatedBlog, blog.id)
  }

  const handleRemoveClick = async () => {
    await onRemoveClick(blog.id)
  }

  return (
    <div data-testid='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button data-testid='showButton' onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
      {
        show
          ? <div data-testid='toggable'>
            <div data-testid='url'>{blog.url}</div>
            <div data-testid='likes'>likes {blog.likes}
              <button value={blog.id} onClick={handleLikeClick}>like</button>
            </div>
            <div data-testid='name'>{blog.user?.name || 'Unknown Creator'}</div>
            {username === blog.user?.username
              ? <button value={blog.id} onClick={handleRemoveClick}>remove</button>
              : <></>
            }
          </div>
          : <></>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLikeClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}
export default Blog