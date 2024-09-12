import { useState } from 'react'

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
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
      {show
        ? 
          <>
            <div>{blog.url}</div>
            likes {blog.likes} 
            <button value={blog.id} onClick={handleLikeClick}>like</button>
            <div>{blog.user.name}</div>
            {username === blog.user.username
              ? <button value={blog.id} onClick={handleRemoveClick}>remove</button>
              : <></>
            }
          </>
        : <></>
      }
    </div> 
  )
}

export default Blog