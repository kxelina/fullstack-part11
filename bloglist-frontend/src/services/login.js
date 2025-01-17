import axios from 'axios'
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://bloglist-backend-5m3q.onrender.com/api/login'
  : '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }