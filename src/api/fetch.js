import axios from 'axios'
import url from './url'
import router from './../router/router'
import request from '../utils/request'


// 登入
export function signIn(data) {
  return request({
    url: `${url.user}/sign_in`,
    method: 'post',
    data
  })
}

// 註冊驗證
export function signUpCheck(data) {
  return request({
    url: `${url.user}/sign_up_check`,
    method: 'post',
    data
  })
}

// 註冊
export function signUp(data) {
  return request({
    url: `${url.user}/sign_up`,
    method: 'post',
    data
  })
}

// 取得個人資料（自己）
export function getMyProfile() {
  return request({
    url: `${url.user}/profile`,
    method: 'get'
  })
}


// get user by id
// export const getUserById = async (userId) => {
//   try {
//     const res = await axios.get(`${url.user}/${userId}`)
//     if (!res.data) return;
//     return res.data
//   }
//   catch (err) {
//     console.log(err)
//   }
// }

export function getUserById(data) {
  return request({
    url: `${url.user}/${data}`,
    method: 'get'
  })
}

// get posts by route queries
// export const getPostByRoute = async (route) => {
//   try {
//     let postUrl = url.post
//     if (route) {
//       const { query } = route
//       const keys = Object.keys(query)
//       keys.forEach((key, i) => {
//         if (i === 0) postUrl += `?${key}=${query[key]}`
//         else postUrl += `&${key}=${query[key]}`
//       })
//     }
//     // axios data
//     const res = await axios.get(postUrl)
//     if (!res.data) return;
//     return res.data
//   }
//   catch (err) {
//     console.log(err)
//   }
// }

export function getPostByRoute(data) {
  let sendUrl = url.post
  if (data) {
    const { query } = data
    const keys = Object.keys(query)
    keys.forEach((key, i) => {
      if (i === 0) sendUrl += `?${key}=${query[key]}`
      else sendUrl += `&${key}=${query[key]}`
    })
  }
  return request({
    url: sendUrl,
    method: 'get'
  })
}

// post a post
// export const postPostByData = async (data) => {
//   try {
//     const res = await axios.post(url.post, data)
//     if (!res.data) return;
//     return res.data
//   }
//   catch (err) {
//     console.log(err)
//   }
// }

export function postPostByData(data) {
  return request({
    url: url.post,
    method: 'post',
    data
  })
}