const API_BASE = 'http://192.168.31.179:5000/v1/mini'
const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'

function isLanHost(hostname) {
  return /^127\.|^localhost$|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(hostname)
}

let IS_DEV = false
try {
  const host = new URL(API_BASE).hostname
  IS_DEV = isLanHost(host)
} catch (e) {
  IS_DEV = false
}

// 通用请求封装函数
function request(url, method = 'GET', data = null, options = {}, retry = true) {
  return new Promise((resolve, reject) => {
    const tokenKey = options.useRefreshToken ? REFRESH_TOKEN_KEY : TOKEN_KEY
    const token = uni.getStorageSync(tokenKey)
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
    const { useRefreshToken, ...restOptions } = options

    uni.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header,
      ...restOptions,
      success: async (res) => {
        if (res.statusCode === 401 || (res.data && res.data.code === 10002)) {
          if (!useRefreshToken) {
            const refreshToken = uni.getStorageSync(REFRESH_TOKEN_KEY)
            if (refreshToken && retry) {
              try {
                const refreshRes = await refreshTokenRequest()
                if (refreshRes && refreshRes.code === 0) {
                  uni.setStorageSync(TOKEN_KEY, refreshRes.data.token)
                  uni.setStorageSync(REFRESH_TOKEN_KEY, refreshRes.data.refreshToken)
                  const retryRes = await request(url, method, data, options, false)
                  resolve(retryRes)
                  return
                }
              } catch (e) {
                // ignore
              }
            }
            uni.removeStorageSync(TOKEN_KEY)
            uni.removeStorageSync(REFRESH_TOKEN_KEY)
          }
          reject(new Error('未登录'))
          return
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (IS_DEV && res.data && typeof res.data === 'object') {
            res.data.__isDev__ = true
          }
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

function refreshTokenRequest() {
  return request('/auth/refresh', 'GET', null, { useRefreshToken: true }, false)
}

// GET 请求封装
export function Get(url, params = null, options = {}) {
  return (additionalParams = {}) => {
    const finalParams = { ...params, ...additionalParams }
    const queryString = finalParams && Object.keys(finalParams).length > 0 
      ? '?' + Object.keys(finalParams).map(key => `${key}=${encodeURIComponent(finalParams[key])}`).join('&')
      : ''
    return request(`${url}${queryString}`, 'GET', null, options)
  }
}

// POST 请求封装
export function Post(url, defaultData = null, options = {}) {
  return (data = {}) => {
    const finalData = { ...defaultData, ...data }
    return request(url, 'POST', finalData, options)
  }
}

// PUT 请求封装
export function Put(url, defaultData = null, options = {}) {
  return (data = {}) => {
    const finalData = { ...defaultData, ...data }
    return request(url, 'PUT', finalData, options)
  }
}

// DELETE 请求封装
export function Delete(url, options = {}) {
  return (params = {}) => {
    const queryString = params && Object.keys(params).length > 0 
      ? '?' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
      : ''
    return request(`${url}${queryString}`, 'DELETE', null, options)
  }
}

// API 接口定义
export const getCertificates = Get('/certificate')
export const createOrder = Post('/order')
export const getOrders = Get('/order/mine')
export function resubmitOrder(id, data) {
  return request(`/order/${id}/resubmit`, 'POST', data)
}

export const alipayLogin = Post('/auth/alipay')
export const refreshToken = () => refreshTokenRequest()
export const alipayNotifyTest = Post('/../alipay/notify/test')
