import { useState } from 'react'

const BlogNewForm = ({
  createNewBlogHandler,
  toggleFormHandler
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (e) => {
    // console.log('title', e.target.value)
    setTitle(e.target.value)
  }

  const handleAuthorChange = (e) => {
    // console.log('author', e.target.value)
    setAuthor(e.target.value)
  }

  const handleUrlChange = (e) => {
    // console.log('url', e.target.value)
    setUrl(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    createNewBlogHandler(newBlog)
  }

  return (
    <>
      <h1>create new</h1>
      <form onSubmit={handleSubmit}>
        <div>
          title <input id='title' type='text' value={title} onChange={handleTitleChange} />
        </div>
        <div>
          author <input id='author' type='text' value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url <input id='url' type='text' value={url} onChange={handleUrlChange} />
        </div>
        <button id='create' type='submit'>create</button>
      </form>
      <button onClick={toggleFormHandler}>cancel</button>
    </>
  )
}
export default BlogNewForm