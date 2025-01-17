import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserdata } from '../reducers/userReducer'
import { useParams } from 'react-router-dom'


const Blogs = () => {
  const dispatch = useDispatch()
  const userID = useParams().id
  const user = useSelector(state =>
    state.user.users.find(user => user.id === userID)
  )

  useEffect(() => {
    dispatch(getUserdata(userID))
  }, [dispatch, userID])

  if (!user) {
    return null
  }

  console.log('user at blogs', user, user.blogs)

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs