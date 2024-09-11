import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/Login'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleUsernameChange = (e) => {
    // console.log('username', e.target.value)
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    // console.log('password', e.target.value)
    setPassword(e.target.value)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login(username, password)

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 

      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
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

  return (
    <div>
      {!user 
        ? <LoginForm usernameHandler={handleUsernameChange} passwordHandler={handlePasswordChange} loginHandler={handleLogin}/>
        : <>
            <h2>blogs</h2>
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>logout</button>
            </p>
            {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
            )}
          </>
      }
      
    </div>
  )
}

export default App