import axios from 'axios'
import router from '../router/router'

const server = axios.create({
  baseURL: 'http://127.0.0.1:3005'
})

server.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    }
    return config
  },
  request => {
    const method = request.method.toUpperCase()
    return request
  },
  config => {
    return config
  },
  error => {
    // do something with request error
    alert('error', error)
    console.log('error', error) // for debug
    return Promise.reject(error)
  }
)

server.interceptors.response.use(
  response => {
    console.log('interceptor:', response)
    const result = {
      ...response,
      target: response?.data?.data || {
      }
    }
    return result
  },
  error => {
    const statusCode = error.response.status
    console.error('interceptor error', error)

    if (statusCode === 404) {
      alert(`${statusCode}: 查無此頁面`)
      // router.push({ name: 'Error404' })
      return
    }
    return error.response
    return Promise.reject(error)
  }
)

export default server