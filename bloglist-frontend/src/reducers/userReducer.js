import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'


const initialState = {
  user: null,
  users: []
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {

    set_User(state, action) {
      state.user = action.payload
    },
    clear_User(state) {
      state.user = null
    },
    set_Users(state, action) {
      state.users = action.payload
    }
  } })

export const { set_User, set_Users, clear_User } = userSlice.actions

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch(set_User(user))
  }
}

export const logoutUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(clear_User())
  }
}

export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(set_User(user))
    }
  }
}


export const getUserdata = (id) => {
  return async dispatch => {
    const user = await userService.getUser(id)
    dispatch(set_User(user))
  }
}

export const getAllUsers = () => {
  return async dispatch => {
    const users = await userService.getAllUsers()
    dispatch(set_Users(users))
  }
}

export default userSlice.reducer