import axios from 'axios'
import router from '../router/router'
import { storeToRefs } from "pinia";
import { useModalStore } from "./../stores/modalStore";
const modalStore = useModalStore();
const { useModalAlert, useModalAlertText } = storeToRefs(modalStore);

// 判斷環境
const isDev = import.meta.env.VITE_ENV === 'dev'

const server = axios.create({
  baseURL: 'http://127.0.0.1:3005'
})

/*
  [請求超時設置]
*/
// timeout 請求時限
axios.defaults.timeout = 500
// retry 請求次數
axios.defaults.retry = 4
// retryDelay 請求間隙
axios.defaults.retryDelay = 1000

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
    if (isDev) console.error(`❌ 發生錯誤：${error}`) // for debug
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
    if (isDev) console.error('interceptor error', error)


    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 400:
          // 各種錯誤
          useModalAlert.value = true
          useModalAlertText.value = error.response.data.message
          break

        case 404:
          // 查無此頁面
          useModalAlert.value = true
          useModalAlertText.value = `${status}: 查無此頁面`
          // router.push({ name: 'Error404' })
          break

        default:
          // 各種錯誤
          useModalAlert.value = true
          useModalAlertText.value = error.response.data.message
          break
      }
    }

    //  若 timeout 伺服器無回應，則重新打 API
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      const { config } = error
      // config.baseURL = ''
      config.__retryCount = config.__retryCount || 0

      if (config.__retryCount >= config.retry) {
        // Reject with the error
        // window.location.reload()
        return Promise.reject(error)
      }

      // Increase the retry count
      config.__retryCount += 1

      // Create new promise to handle exponential backoff
      var backoff = new Promise(function (resolve) {
        setTimeout(function () {

          useModalAlert.value = true
          useModalAlertText.value = '伺服器沒有即時回應，正在嘗試重新請求服務...'
          resolve()
        }, config.retryDelay || 1)
      })

      return backoff
        .then(() => {
          return axios(config)
        })
        .finally(() => {
          // hideLoading()
        })
        .catch(error => {
          console.error(error)
          // hideLoading()
        })
    }

    // return error.response
    return Promise.reject(error)
  }
)

export default server