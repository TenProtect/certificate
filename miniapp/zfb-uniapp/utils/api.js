const API_BASE = 'http://localhost:5000/v1/mini'
const TOKEN_KEY = 'token'

// 通用请求封装函数
function request(url, method = 'GET', data = null, options = {}) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync(TOKEN_KEY)
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    uni.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header,
      ...options,
      success: (res) => {
        if (res.statusCode === 401 || (res.data && res.data.code === 10002)) {
          uni.removeStorageSync(TOKEN_KEY)
          reject(new Error('未登录'))
          return
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
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
