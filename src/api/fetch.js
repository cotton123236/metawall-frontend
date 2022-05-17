import axios from 'axios'
import router from './../router/router'


export const fetchUser = async (url, userId) => {
  const res = await axios.get(`${url}/${userId}`)
  if (!res.data) return;
  return res.data
}