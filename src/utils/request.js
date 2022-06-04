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
axios.defaults.timeout = 1000
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
    if (isDev) console.log('interceptor:', response)

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
      // 後端自定義代碼
      const { name } = error.response.data.error

      // 後端自定義訊息
      const { message } = error.response.data

      switch (status) {
        case 400:
          // 各種錯誤
          useModalAlert.value = true
          let msg = ''

          switch (name) {
            case '40001':
              msg = `，${message}`
              useModalAlertText.value = `格式錯誤${msg}`
              break;

            case '40002':
              msg = `，${message}`
              if (message.includes('您的密碼不正確')) msg = "，帳號或密碼錯誤"
              if (message.includes('已註冊此用戶')) msg = "，此 Email 已被註冊"
              if (message.includes('您的舊密碼不正確')) msg = "，您的原密碼不正確"
              useModalAlertText.value = `內容錯誤${msg}`
              break;

            case '40003':
              useModalAlertText.value = "你尚未登入"
              router.push({ name: 'login' })
              break;

            case '40004':
              msg = `，${message}`
              useModalAlertText.value = `操作錯誤${msg}`
              break;

            case '40005':
              if (message.includes('File too large')) msg = "，檔案超過 2MB 限制，請重新上傳"
              useModalAlertText.value = `錯誤${msg}`
              break;

            case '40010':
              msg = `，${message}`
              useModalAlertText.value = `ID 錯誤${msg}`
              break;

            case '40011':
              useModalAlertText.value = "Mongoose 存在重複的 _id"
              break;

            default:
              useModalAlertText.value = "格式錯誤"
              break;
          }
          break

        case 401:
          useModalAlert.value = true
          useModalAlertText.value = "身份驗證錯誤"

        case 404:
          // 查無此頁面
          useModalAlert.value = true
          useModalAlertText.value = `${status}: 查無此頁面`
          // router.push({ name: 'Error404' })
          break

        case 500:
          useModalAlert.value = true
          switch (name) {
            case '50001':
              useModalAlertText.value = '上傳發生錯誤，請重新上傳'
              break;

            default:
              useModalAlertText.value = `${status}: 系統錯誤，請洽系統管理員`
              // router.push({ name: 'Error500' })
              break;
          }
          break

        default:
          // 各種錯誤
          useModalAlert.value = true
          useModalAlertText.value = `${status}: 系統錯誤，請洽系統管理員`
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
          useModalAlert.value = true
          useModalAlertText.value = '系統錯誤，請洽系統管理員'
          // router.push({ name: 'Error500' })
          console.error(error)
          // hideLoading()
        })
    }

    return error.response
    // return Promise.reject(error)
  }
)

export default server