import { useState, useEffect , useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { getBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import BlogDetails from './components/BlogDetails'
import Navbar from './components/NavBar'


const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const loggeduser = useRef(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  useEffect(() => { dispatch(initializeUser()) }, [dispatch])

  useEffect(() => {
    if (user && !loggeduser.current) {
      loggeduser.current = user.user
    }
    if (!user) {
      loggeduser.current = null
    }
  }, [user])



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await dispatch(loginUser({ username, password }))
      dispatch(setNotification('login successful', 'success', 5))
      setUsername('')
      setPassword('')
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error', 5))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setNotification('logout successful', 'success', 5))
  }

  const handlecreateBlog = async (newBlog) => {
    try {
      await dispatch(createBlog(newBlog))
      dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success', 5))
      setBlogFormVisible(false)
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error', 5))
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    const confirmDelete = window.confirm(`remove "${blogToDelete.title}" by "${blogToDelete.author}"?`)
    if (confirmDelete) {
      try {
        await dispatch(deleteBlog(blogToDelete))
        dispatch(getBlogs())
        dispatch(setNotification(`"${blogToDelete.title}" by "${blogToDelete.author}" deleted`, 'success', 5))
      } catch (error) {
        dispatch(setNotification(error.response.data.error, 'error', 5))
      }
    }
  }

  const handleLike = async (blog) => {
    try {
      await dispatch(likeBlog(blog))
      dispatch(setNotification(`you liked "${blog.title}" by "${blog.author}"`, 'success', 5))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'error', 5))
    }
  }

  const sortedbylikesblogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Router>
      <div>
        <Notification />
        {!user.user && (
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin} />
        )}
        {user.user && (
          <div>
            <Navbar user={loggeduser.current} handleLogout={handleLogout}/>
            <h2>blog app</h2>
            <Routes>
              <Route path="/users" element={ <Users />} />
              <Route path="/users/:id" element={ <Blogs />} />
              <Route path="/blogs/:id" element={ <BlogDetails blogs = {blogs} handleLike={handleLike}/>} />
              <Route path= "/"  element = {
                <>
                  {!blogFormVisible && (
                    <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
                  )}
                  {blogFormVisible && <BlogForm createBlog={handlecreateBlog} setBlogFormVisible={setBlogFormVisible} />}
                  {sortedbylikesblogs.map(blog =>
                    <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog.id)}/>
                  )}
                </>
              }/>
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
