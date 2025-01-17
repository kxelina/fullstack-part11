import { useState } from 'react'

const BlogForm = ({ createBlog, setBlogFormVisible }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')


  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
            title
          <input type="text" value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} placeholder='write blog title here'/>
        </div>
        <div>
            author
          <input type="text" value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} placeholder='write blog author here'/>
        </div>
        <div>
            url
          <input type="text" value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} placeholder='write blog url here'/>
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
      </form>
    </div>
  )
}

export default BlogForm