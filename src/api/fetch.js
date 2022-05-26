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

// 取得使用者資料 by id
export function getUserById(data) {
  return request({
    url: `${url.user}/profile/${data}`,
    method: 'get'
  })
}

// 取得所有貼文 by route query
export function getPostByRoute(route) {
  let sendUrl = url.post
  if (route) {
    const { query } = route
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

// 取得所有貼文 by id
export function getPostById(id) {
  return request({
    url: `${url.post}/${id}`,
    method: 'get'
  })
}

// post 貼文
export function postPostByData(data) {
  return request({
    url: url.post,
    method: 'post',
    data
  })
}