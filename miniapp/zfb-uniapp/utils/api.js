const API_BASE = 'http://localhost:5000/v1/mini'

// 通用请求封装函数
function request(url, method = 'GET', data = null, options = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      ...options,
      success: (res) => {
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
