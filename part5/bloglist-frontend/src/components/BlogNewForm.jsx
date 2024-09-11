const BlogNewForm = ({ 
  title, 
  author, 
  url, 
  titleHandler, 
  authorHandler,
  urlHandler,
  createNewBlogHandler
}) => {
  return (
    <>
      <h1>create new</h1>
      <form onSubmit={createNewBlogHandler}>
        <div>
          title <input type='text' value={title} onChange={titleHandler} />
        </div>
        <div>
          author <input type='text' value={author} onChange={authorHandler} />
        </div>
        <div>
          url <input type='text' value={url} onChange={urlHandler} />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
    
  )
}
export default BlogNewForm