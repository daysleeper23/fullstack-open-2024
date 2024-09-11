import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogNewForm from './components/BlogNewForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState({ type: 'success', message: ''})

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    if (user)
      fetchBlogs()
  }, [user])

  // ==============================
  // SECTION: Input Change Detection
  // ==============================

  const handleUsernameChange = (e) => {
    // console.log('username', e.target.value)
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    // console.log('password', e.target.value)
    setPassword(e.target.value)
  }

  const handleTitleChange = (e) => {
    console.log('title', e.target.value)
    setTitle(e.target.value)
  }

  const handleAuthorChange = (e) => {
    console.log('author', e.target.value)
    setAuthor(e.target.value)
  }

  const handleUrlChange = (e) => {
    console.log('url', e.target.value)
    setUrl(e.target.value)
  }

  // ==============================
  // SECTION: User Authentication
  // ==============================

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login(username, password)
      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 

      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log('catch error')
      setErrorMessage({ type: 'error', message: 'Wrong username or password' })
      setTimeout(() => {
        setErrorMessage({ type: 'error', message: '' })
      }, 5000)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.setItem(
      'loggedBlogAppUser', JSON.stringify('')
    ) 
  }

  // ==============================
  // SECTION: Blog Creation
  // ==============================
  const handleCreateBlog = async (e) => {

    // console.log('creating a blog', title, author, url)
    e.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    try {
      const blog = await blogService.createNew(newBlog)
      // console.log('new blog', blog)
      const updatedBlogs = blogs.concat(blog)
      // console.log('new blogs after concat', updatedBlogs)

      setBlogs(updatedBlogs)
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorMessage({type: 'success', message: `a new blog ${blog.title} by ${blog.author} added`})
      setTimeout(() => {
        setErrorMessage({ type: 'success', message: '' })
      }, 5000)
    }
    catch (exception) {
      setErrorMessage({ type: 'error', message: 'Error while creating blog' })
      setTimeout(() => {
        setErrorMessage({ type: 'success', message: '' })
      }, 5000)
    }
  }

  return (
    <div>
      {!user 
        ? <LoginForm username={username} password={password} 
            messageType={errorMessage.type} messageContent={errorMessage.message}
            usernameHandler={handleUsernameChange} 
            passwordHandler={handlePasswordChange} 
            loginHandler={handleLogin}
          />
        : <>
            <h1>blogs</h1>
            {errorMessage.message !== ''
              ? <Notification type={errorMessage.type} message={errorMessage.message} />
              : <></>
            }
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>logout</button>
            </p>

            <BlogNewForm title={title} author={author} url={url}
              titleHandler={handleTitleChange}
              authorHandler={handleAuthorChange}
              urlHandler={handleUrlChange}
              createNewBlogHandler={handleCreateBlog}
            />

            {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
          </>
      }
      
    </div>
  )
}

export default App