/**
 * request.js
 * 封装uni-app请求方法
 */

// 基础请求路径
const BASE_URL = ''
// 请求超时时间（毫秒）
const TIMEOUT = 10000
// 固定的token值
const TOKEN = 'pat_RHaWUG7hVWOpH5iVBFuJ3LTm40BL7Bpjy3Qi2y9cwOuZY0KfTIXHyp3pwNBNSqq5'

// 请求拦截器
const requestInterceptors = []

// 响应拦截器
const responseInterceptors = []

/**
 * 添加请求拦截器
 * @param {Function} interceptor - 拦截器函数，接收config参数并返回修改后的config
 */
export const addRequestInterceptor = (interceptor) => {
  requestInterceptors.push(interceptor)
}

// 添加默认的token拦截器
addRequestInterceptor((config) => {
  // 为每个请求添加token到header
  if (!config.header) {
    config.header = {}
  }
  config.header['Authorization'] = 'Bearer '+TOKEN
  return config
})

/**
 * 添加响应拦截器
 * @param {Function} interceptor - 拦截器函数，接收response参数并返回修改后的response
 */
export const addResponseInterceptor = (interceptor) => {
  responseInterceptors.push(interceptor)
}

/**
 * 应用请求拦截器
 * @param {Object} config - 请求配置
 * @returns {Object} - 处理后的请求配置
 */
const applyRequestInterceptors = (config) => {
  let currentConfig = { ...config }
  for (const interceptor of requestInterceptors) {
    currentConfig = interceptor(currentConfig) || currentConfig
  }
  return currentConfig
}

/**
 * 应用响应拦截器
 * @param {Object} response - 响应数据
 * @returns {Object} - 处理后的响应数据
 */
const applyResponseInterceptors = (response) => {
  let currentResponse = { ...response }
  for (const interceptor of responseInterceptors) {
    currentResponse = interceptor(currentResponse) || currentResponse
  }
  return currentResponse
}

/**
 * 统一错误处理
 * @param {Object} error - 错误信息
 */
const handleError = (error) => {
  // 可以在这里统一处理错误，如提示、日志等
  console.error('请求错误:', error)
  return Promise.reject(error)
}

/**
 * 封装的请求方法
 * @param {Object} options - 请求配置
 * @returns {Promise} - 返回Promise对象
 */
const request = (options) => {
  // 合并默认配置
  const config = {
    url: '',
    method: 'GET',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    timeout: TIMEOUT,
    ...options
  }

  // 拼接完整请求路径
  if (config.url && !config.url.startsWith('http')) {
    config.url = BASE_URL + config.url
  }

  // 应用请求拦截器
  const interceptedConfig = applyRequestInterceptors(config)

  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedConfig,
      success: (res) => {
        // 应用响应拦截器
        const interceptedRes = applyResponseInterceptors(res)
        
        // 根据状态码判断请求是否成功
        if (interceptedRes.statusCode >= 200 && interceptedRes.statusCode < 300) {
          resolve(interceptedRes.data)
        } else {
          // 处理请求失败
          const error = {
            statusCode: interceptedRes.statusCode,
            errMsg: interceptedRes.errMsg || '请求失败',
            data: interceptedRes.data
          }
          handleError(error)
          reject(error)
        }
      },
      fail: (err) => {
        handleError(err)
        reject(err)
      }
    })
  })
}

/**
 * GET请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
request.get = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'GET',
    ...options
  })
}

/**
 * POST请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
request.post = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'POST',
    ...options
  })
}

/**
 * PUT请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
request.put = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'PUT',
    ...options
  })
}

/**
 * DELETE请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
request.delete = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'DELETE',
    ...options
  })
}

// 导出请求方法
export default request