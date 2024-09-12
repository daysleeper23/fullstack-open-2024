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

  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
      // console.log('effect user:', user)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
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
  const createBlog = async (blog) => {

    // console.log('creating a blog', title, author, url)
    // e.preventDefault()
    console.log('blog to create:', blog)

    try {
      const newBlog = await blogService.createNew(blog)
      newBlog.user = user
      const updatedBlogs = blogs.concat(newBlog)
      updatedBlogs.sort((a, b) => b.likes - a.likes)

      setBlogs(updatedBlogs)
      setTitle('')
      setAuthor('')
      setUrl('')
      setShowNew(false)
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

  // ==============================
  // SECTION: Increase Blog's Likes
  // ==============================

  const increaseLike = async (blog, id) => {
    // console.log('current blog id', blog.id)
    try {
      const updatedBlog = await blogService.updateOne(blog, id)

      if (updatedBlog) {
        const index = await blogs.findIndex(bl => bl.id === id)
        const newBlogs = [...blogs]
        newBlogs[index].likes += 1
        newBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(newBlogs)
      }
    }
    catch (exception) {
      setErrorMessage({ type: 'error', message: 'Error while updating blog' })
      setTimeout(() => {
        setErrorMessage({ type: 'success', message: '' })
      }, 5000)
    }
  }

  // ==============================
  // SECTION: Remove Single Blog
  // ==============================
  const removeBlog = async (id) => {
    // console.log('current blog id', e.target.value)
    const deletingBlog = blogs.find(blog => blog.id === id)

    if (window.confirm(`Remove blog ${deletingBlog.title} by ${deletingBlog.author} ?`)) {
      try {
        await blogService.deleteOne(id)
        const index = await blogs.findIndex(blog => blog.id === id)
        const newBlogs = [...blogs]
        newBlogs.splice(index, 1)
        setBlogs(newBlogs)
      }
      catch (exception) {
        setErrorMessage({ type: 'error', message: 'Error while removing blog' })
        setTimeout(() => {
          setErrorMessage({ type: 'success', message: '' })
        }, 5000)
      }
    }
  }

  // ==============================
  // SECTION: Toggle Blog Creation Form
  // ==============================
  const handleShowNew = () => {
    setShowNew(!showNew)
  }

  // ==============================
  // SECTION: Component UI
  // ==============================
  // if (user)
  //   console.log('user id:', user.id)

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
            {showNew
              ? <BlogNewForm
                  createNewBlogHandler={createBlog}
                  toggleFormHandler={handleShowNew}
                />
              : <button onClick={handleShowNew}>create new blog</button>
            }

            {blogs.map(blog => <Blog key={blog.id} blog={blog} onLikeClick={increaseLike} onRemoveClick={removeBlog} username={user.username}/>)}
          </>
      }
      
    </div>
  )
}

export default App