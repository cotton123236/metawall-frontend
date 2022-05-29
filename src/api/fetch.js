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

// 取得個人資料（別人） by id
export function getProfileById(data) {
  return request({
    url: `${url.user}/profile/${data}`,
    method: 'get'
  })
}

// 取得所有貼文 by route query
export function getPostsByRoute(route) {
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
export function getPostsById(id) {
  return request({
    url: `${url.post}/${id}`,
    method: 'get'
  })
}

// 新增貼文
export function postNewPost(data) {
  return request({
    url: url.post,
    method: 'post',
    data
  })
}

// 修改貼文
export function patchEditPost(data) {
  const { _id, content, image } = data
  return request({
    url: `${url.post}/${_id}`,
    method: 'patch',
    data: {
      content,
      image
    }
  })
}

// 取得個人追蹤列表
export function getFollowList() {
  return request({
    url: `${url.user}/follows`,
    method: 'get'
  })
}

// 取消追蹤
export function deleteFollowByperson(id) {
  return request({
    url: `${url.user}/follows/${id}`,
    method: 'delete'
  })
}
