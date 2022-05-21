import axios from 'axios'
import url from './url'
import router from './../router/router'


export const fetchUser = async (userId) => {
  const res = await axios.get(`${url.user}/${userId}`)
  if (!res.data) return;
  return res.data
}