import axios from 'axios'
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://bloglist-backend-5m3q.onrender.com/api/users'
  : '/api/users'

const getAllUsers = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getUser = (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getUser, getAllUsers }