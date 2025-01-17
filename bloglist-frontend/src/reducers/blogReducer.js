import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
    addComment(state, action) {
      const { id, comment } = action.payload
      return state.map(blog => blog.id === id ? { ...blog, comments: blog.comments.concat(comment) } : blog)
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog, addComment } = blogSlice.actions

export const getBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    await blogService.deleteblog(blog.id)
    dispatch(removeBlog(blog.id))
  }
}

export const commentBlog = (id, comment) => {
  return async dispatch => {
    await blogService.commentblog(id, comment)
    dispatch(addComment({ id, comment : comment.comment }))
  }
}

export default blogSlice.reducer