import axios from 'axios'
import url from './url'
import router from './../router/router'


// get user by id
export const getUserById = async (userId) => {
  try {
    const res = await axios.get(`${url.user}/${userId}`)
    if (!res.data) return;
    return res.data
  }
  catch(err) {
    console.log(err)
  }
}

// get posts by route queries
export const getPostByRoute = async (route) => {
  try {
    let postUrl = url.post
    if (route) {
      const { query } = route
      const keys = Object.keys(query)
      keys.forEach((key, i) => {
        if (i === 0) postUrl += `?${key}=${query[key]}`
        else postUrl += `&${key}=${query[key]}`
      })
    }
    // axios data
    const res = await axios.get(postUrl)
    if (!res.data) return;
    return res.data
  }
  catch(err) {
    console.log(err)
  }
}

// post a post
export const postPostByData = async (data) => {
  try {
    const res = await axios.post(url.post, data)
    if (!res.data) return;
    return res.data
  }
  catch(err) {
    console.log(err)
  }
}