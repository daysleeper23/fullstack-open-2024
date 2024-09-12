import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLikeClick }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [show, setShow] = useState(false)

  

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
      {show
        ? 
          <>
            <div>{blog.url}</div>
            likes {blog.likes} 
            <button value={blog.id} onClick={onLikeClick}>like</button>
            <div>{blog.user.name}</div>
          </>
        : <></>
      }
    </div> 
  )
}

export default Blog