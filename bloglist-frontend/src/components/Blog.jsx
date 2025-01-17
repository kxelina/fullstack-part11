import { Link } from 'react-router-dom'


const Blog = ({ blog, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style = {blogStyle} data-testid='blog'>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
      <button onClick={() => handleDelete(blog.id)}>delete</button>
    </div>
  )}


export default Blog