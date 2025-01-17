import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { commentBlog } from '../reducers/blogReducer'

const BlogDetails = ({ handleLike, blogs }) => {
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')
  const blogID = useParams().id
  const blog = blogs.find(b => b.id === blogID)

  if (!blog) return null

  const handleComment = (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, { comment }))
    setComment('')
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.url}</p>
      <p>{blog.likes} likes <button onClick={() => handleLike(blog)}>like</button></p>
      <p>added by {blog.author}</p>
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetails
