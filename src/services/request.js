import axios from 'axios'

/**
 * Token管理模块
 * 负责Token的存储、获取、刷新和清空
 */
const TokenManager = {
  // Token缓存配置
  TOKEN_KEY: 'wps_ai_contract_token',
  TIMESTAMP_KEY: 'wps_ai_contract_token_timestamp',
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟（毫秒）

  /**
   * 获取缓存的Token
   * @returns {string|null} Token或null
   */
  getToken() {
    const token = localStorage.getItem(this.TOKEN_KEY)
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY)

    if (!token || !timestamp) {
      return null
    }

    // 检查Token是否过期
    const now = Date.now()
    const cacheTime = parseInt(timestamp, 10)
    if (now - cacheTime > this.CACHE_DURATION) {
      // Token已过期，清空
      this.clearToken()
      return null
    }

    return token
  },

  /**
   * 保存Token
   * @param {string} token - 要保存的Token
   */
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString())
  },

  /**
   * 检查Token是否有效且未过期
   * @returns {boolean} Token是否有效
   */
  hasValidToken() {
    return this.getToken() !== null
  },

  /**
   * 清空Token
   */
  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.TIMESTAMP_KEY)
  }
}

/**
 * 创建axios实例
 */
const service = axios.create({
  // 基础URL，从环境变量读取或使用默认值
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://060cee171725469eb9971506b1de9380--5050.ap-shanghai2.cloudstudio.club',
  // 请求超时时间（秒）
  timeout: 120000,
  // 默认请求头
  headers: {
    'Content-Type': 'application/json'
  }
})

// 登录状态标记，防止多次登录请求
let isRefreshing = false
// 等待登录完成的请求队列
let requestsQueue = []

/**
 * 处理等待队列中的请求
 * @param {string} token - 新Token
 */
const processQueue = (token) => {
  console.log(`[Token管理] 处理等待队列，队列长度: ${requestsQueue.length}`)
  requestsQueue.forEach((callback) => callback(token))
  requestsQueue = []
}

/**
 * 获取新Token的函数（需要传入用户名和密码）
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<string>} 返回Token
 */
const loginAndGetToken = async (username, password) => {
  try {
    console.log('[Token管理] 开始登录获取Token')
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'https://060cee171725469eb9971506b1de9380--5050.ap-shanghai2.cloudstudio.club'}/api/auth/token`,
      new URLSearchParams({
        username,
        password,
        grant_type: 'password'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const token = response.data.access_token
    if (token) {
      TokenManager.setToken(token)
      console.log('[Token管理] Token获取成功')
    }
    return token
  } catch (error) {
    console.error('[Token管理] 登录失败:', error.message)
    throw error
  }
}

/**
 * 请求拦截器
 * 负责在请求前添加Token，如果没有Token则自动尝试获取
 */
service.interceptors.request.use(
  async (config) => {
    console.log(`[请求拦截器] 处理请求: ${config.url}`)

    let token = TokenManager.getToken()

    // 如果没有有效的Token，且不是登录请求，则需要获取Token
    if (!token && !config.url.includes('/api/auth/token')) {
      console.log('[请求拦截器] 没有有效Token，需要获取')

      // 为了防止多个请求同时触发登录，使用队列机制
      if (!isRefreshing) {
        isRefreshing = true
        try {
          console.log('[请求拦截器] 开始获取Token')
          // 这里需要从某个地方获取用户名和密码
          // 可以从localStorage或其他全局状态管理获取
          const credentials = JSON.parse(
            sessionStorage.getItem('wps_ai_contract_credentials') || '{}'
          )
          if (credentials.username && credentials.password) {
            token = await loginAndGetToken(credentials.username, credentials.password)
            processQueue(token)
          } else {
            console.warn('[请求拦截器] 未找到用户凭证，无法自动登录')
          }
        } catch (error) {
          console.error('[请求拦截器] 自动登录失败:', error.message)
          requestsQueue = []
        } finally {
          isRefreshing = false
        }
      } else {
        // 如果正在刷新Token，将当前请求加入队列
        console.log('[请求拦截器] Token正在刷新，将请求加入队列')
        return new Promise((resolve) => {
          requestsQueue.push((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`
            resolve(config)
          })
        })
      }
    }

    // 添加Token到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[请求拦截器] 已添加Token到请求头')
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 负责统一处理响应格式、错误处理等
 */
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 特殊处理OAuth2 token响应（登录接口）
    if (res.access_token && response.config.url.includes('/api/auth/token')) {
      return {
        success: true,
        code: 200,
        message: '登录成功',
        data: res
      }
    }

    // 处理标准API响应格式
    // 如果响应包含detail字段（通常是错误详情），则是错误响应
    if (res.detail) {
      const errorMessage = Array.isArray(res.detail)
        ? res.detail[0]?.msg || res.detail[0]?.message || '请求失败'
        : res.detail.msg || res.detail.message || '请求失败'

      return Promise.reject(new Error(errorMessage))
    }

    // 成功响应，统一格式化处理
    // 如果响应有message或msg字段，说明是标准格式（可能有data包装）
    // 如果响应有data字段，直接返回res（整个响应就是data）
    // 文件上传等接口直接返回整个对象

    // 修复：处理特殊情况 - response字段可能是字符串而不是对象
    if (res.response && typeof res.response === 'string') {
      try {
        // console.log('[响应拦截器] 检测到response是字符串，尝试解析');
        const parsedResponse = JSON.parse(res.response)
        // console.log('[响应拦截器] 解析后的response:', parsedResponse);

        // 替换原来的字符串response为解析后的对象
        const fixedRes = {
          ...res,
          response: parsedResponse
        }

        // 检查是否是FinancialReportAgent的响应格式
        if (fixedRes.response) {
          // console.log('[响应拦截器] 检测到FinancialReportAgent响应格式');
          return {
            success: true,
            code: 200,
            message: '成功',
            data: fixedRes // 返回修复后的对象
          }
        }
      } catch (parseError) {
        console.error('[响应拦截器] 解析response字符串失败:', parseError)
      }
    }

    // 检查是否是FinancialReportAgent的响应格式
    if (res.response) {
      // console.log('[响应拦截器] 检测到FinancialReportAgent响应格式');
      return {
        success: true,
        code: 200,
        message: '成功',
        data: res // 直接返回包含response字段的对象
      }
    }

    return {
      success: true,
      code: 200,
      message: res.message || res.msg || '成功',
      data: res.data || res // 兼容两种格式：有data字段的或直接返回的
    }
  },
  (error) => {
    // HTTP错误处理
    let message = '网络错误，请稍后重试'
    let code = 500

    if (error.response) {
      code = error.response.status
      const data = error.response.data

      // 优先使用后端返回的实际错误信息
      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          message = data.detail[0]?.msg || data.detail[0]?.message || '请求失败'
        } else if (typeof data.detail === 'string') {
          message = data.detail
        } else {
          message = data.detail.msg || data.detail.message || '请求失败'
        }
      } else if (data?.message) {
        message = data.message
      } else if (data?.msg) {
        message = data.msg
      }

      // 处理特定HTTP状态码
      switch (code) {
        case 401:
          message = message || '登录状态已过期，请重新登陆'
          TokenManager.clearToken()
          // 可以在这里触发重新登录逻辑
          break
        case 403:
          message = message || '拒绝访问'
          break
        case 404:
          message = message || '请求资源不存在'
          break
        case 500:
          message = message || '服务器内部错误'
          break
        case 422:
          // 数据验证错误
          message = message || '数据验证失败'
          break
        default:
          message = message || '网络错误，请稍后重试'
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message = '服务器无响应'
    } else {
      // 其他错误
      message = error.message || message
    }

    // 返回标准化的错误对象
    return Promise.reject({
      success: false,
      code,
      message,
      error: error.response?.data || error.message
    })
  }
)

/**
 * 请求API的通用方法
 */
const request = {
  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} config - 请求配置
   * @returns {Promise} 响应Promise
   */
  get(url, config = {}) {
    if (config.params !== undefined) {
      return service.get(url, config)
    }
    return service.get(url, { params: config })
  },

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {Object} config - 请求配置
   * @returns {Promise} 响应Promise
   */
  post(url, data = {}, config = {}) {
    return service.post(url, data, config)
  },

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {Object} config - 请求配置
   * @returns {Promise} 响应Promise
   */
  put(url, data = {}, config = {}) {
    return service.put(url, data, config)
  },

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} config - 请求配置
   * @returns {Promise} 响应Promise
   */
  delete(url, config = {}) {
    if (typeof config === 'object' && !Array.isArray(config)) {
      return service.delete(url, config)
    }
    return service.delete(url, { params: config })
  },

  /**
   * 文件上传
   * @param {string} url - 请求URL
   * @param {FormData} formData - FormData对象
   * @param {Function} onUploadProgress - 上传进度回调
   * @returns {Promise} 响应Promise
   */
  upload(url, formData, onUploadProgress) {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  },

  /**
   * 文件下载
   * @param {string} url - 请求URL
   * @param {Object} config - 请求配置
   * @returns {Promise} 响应Promise
   */
  download(url, config = {}) {
    return service.get(url, {
      ...config,
      responseType: 'blob'
    })
  }
}

/**
 * 导出TokenManager供外部使用
 */
export const useTokenManager = () => {
  return {
    getToken: () => TokenManager.getToken(),
    setToken: (token) => TokenManager.setToken(token),
    hasValidToken: () => TokenManager.hasValidToken(),
    clearToken: () => TokenManager.clearToken()
  }
}

/**
 * 导出登录函数
 */
export const login = loginAndGetToken

/**
 * 导出axios实例（如需直接使用）
 */
export const axiosInstance = service

// 导出默认对象
export default request
