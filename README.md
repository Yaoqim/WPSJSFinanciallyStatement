# WPS AI Contract 请求模板使用指南

## 概述

该请求模板是一个通用的API请求解决方案，可供所有WPS插件项目使用。包含自动Token管理、缓存、请求拦截、响应格式化等功能。

## 核心文件

### 1. `request.js` - 通用请求模板

核心请求库，负责：

- **Token管理**：自动存储、获取、验证Token，支持30分钟缓存
- **请求拦截**：自动添加Authorization header
- **响应拦截**：统一格式化响应、错误处理
- **自动登录**：当Token过期时自动重新获取

### 2. `api.js` - API接口封装

基于request.js的具体接口实现，包含：

- 认证接口 (`authApi`)
- 聊天接口 (`chatApi`)
- 知识库接口 (`knowledgeApi`)
- 系统接口 (`systemApi`)
- 仪表板接口 (`dashboardApi`)
- 评估接口 (`evaluationApi`)
- 思维导图接口 (`mindmapApi`)
- 知识图谱接口 (`graphApi`)
- 任务接口 (`tasksApi`)

## 环境配置

### 1. 配置API基础URL

在 `.env` 文件中设置：

```env
VITE_API_BASE_URL=http://localhost:8000
```

或在 `.env.development` 中：

```env
VITE_API_BASE_URL=http://dev-api.example.com
```

或在 `.env.production` 中：

```env
VITE_API_BASE_URL=https://api.example.com
```

### 2. 初始化应用时存储凭证

在应用启动或登录时，将用户凭证保存到sessionStorage：

```javascript
// 登录成功后
sessionStorage.setItem(
  'wps_ai_contract_credentials',
  JSON.stringify({
    username: 'admin',
    password: 'password123'
  })
)
```

## 使用方法

### 基础使用

#### 1. 导入API模块

```javascript
import { authApi, chatApi, knowledgeApi, systemApi } from '@/services/api'

// 或导入单个request模块
import request from '@/services/request'
import { useTokenManager, login } from '@/services/request'
```

#### 2. 调用API接口

```javascript
// 示例1：获取当前用户信息
async function getCurrentUserInfo() {
  try {
    const response = await authApi.getCurrentUser()
    console.log('用户信息:', response.data)
  } catch (error) {
    console.error('获取用户信息失败:', error.message)
  }
}

// 示例2：获取所有智能体
async function fetchAgents() {
  try {
    const response = await chatApi.getAgents()
    console.log('智能体列表:', response.data)
  } catch (error) {
    console.error('获取智能体失败:', error.message)
  }
}

// 示例3：查询知识库
async function queryKnowledge(dbId, query) {
  try {
    const response = await knowledgeApi.queryDatabase(dbId, {
      query: query,
      meta: {}
    })
    console.log('查询结果:', response.data)
  } catch (error) {
    console.error('查询失败:', error.message)
  }
}
```

#### 3. 处理响应

```javascript
// 所有API响应都遵循统一格式：
// {
//   success: boolean,      // 是否成功
//   code: number,          // 状态码
//   message: string,       // 提示消息
//   data: any              // 数据内容
// }

async function handleApiResponse() {
  try {
    const response = await authApi.getCurrentUser()

    if (response.success) {
      // 成功处理
      const userData = response.data
      console.log('用户ID:', userData.user_id)
      console.log('用户名:', userData.username)
    } else {
      // 失败处理（一般不会走这里，因为会被catch捕获）
      console.error('请求失败:', response.message)
    }
  } catch (error) {
    // 错误处理
    // error对象格式：
    // {
    //   success: false,
    //   code: number,
    //   message: string,
    //   error: any
    // }
    console.error('请求异常:', error.message)
  }
}
```

## Token管理

### 自动Token管理

Token的获取、存储、验证、更新都是自动的，无需手动操作。当Token过期时：

1. 系统自动检测Token过期
2. 如果有存储的用户凭证，自动重新登录获取新Token
3. 将新Token应用于待处理的请求

### 手动Token管理

如果需要手动控制Token，使用 `useTokenManager` hook：

```javascript
import { useTokenManager, login } from '@/services/request'

const tokenManager = useTokenManager()

// 检查Token是否有效
if (tokenManager.hasValidToken()) {
  console.log('Token有效')
} else {
  console.log('Token已过期或不存在')
}

// 手动获取Token
const token = tokenManager.getToken()
console.log('当前Token:', token)

// 手动设置Token
tokenManager.setToken('new_token_here')

// 清空Token
tokenManager.clearToken()

// 手动登录
try {
  const response = await login('username', 'password')
  console.log('登录成功，Token已自动保存')
} catch (error) {
  console.error('登录失败:', error.message)
}
```

## 常见场景

### 场景1：应用启动时的登录流程

```javascript
// main.js 或 App.vue 的mounted中
import { useTokenManager } from '@/services/request'

const tokenManager = useTokenManager()

// 应用启动时检查Token
if (!tokenManager.hasValidToken()) {
  // Token不存在或已过期，跳转到登录页
  router.push('/login')
}

// 在登录页中调用登录接口
async function handleLogin(username, password) {
  try {
    const response = await authApi.login(username, password)
    // Token会自动保存，此后所有请求都会自动包含Token
    console.log('登录成功')
    // 保存用户凭证以便自动登录
    sessionStorage.setItem('wps_ai_contract_credentials', JSON.stringify({ username, password }))
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error.message)
  }
}
```

### 场景2：文件上传

```javascript
// 上传用户头像
async function uploadUserAvatar(file) {
  try {
    const response = await authApi.uploadAvatar(file)
    console.log('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error.message)
  }
}

// 上传知识库文档
async function uploadKnowledgeFile(file, dbId) {
  try {
    const response = await knowledgeApi.uploadFile(file, dbId)
    console.log('文档上传成功')
  } catch (error) {
    console.error('文档上传失败:', error.message)
  }
}

// 上传评估基准
async function uploadBenchmark(dbId, file, name) {
  try {
    const response = await evaluationApi.uploadEvaluationBenchmark(dbId, file, name, '基准描述')
    console.log('基准上传成功')
  } catch (error) {
    console.error('基准上传失败:', error.message)
  }
}
```

### 场景3：文件下载

```javascript
// 导出知识库
async function exportKnowledgeBase(dbId) {
  try {
    const blob = await knowledgeApi.exportDatabase(dbId, 'xlsx')
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `knowledge_base_${dbId}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出失败:', error.message)
  }
}

// 下载文档
async function downloadDocument(dbId, docId) {
  try {
    const blob = await knowledgeApi.downloadDocument(dbId, docId)
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document_${docId}`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载失败:', error.message)
  }
}
```

### 场景4：批量操作

```javascript
// 并发获取多个智能体信息
async function fetchMultipleAgents(agentIds) {
  try {
    const promises = agentIds.map((id) => chatApi.getAgentDetail(id))
    const results = await Promise.all(promises)
    console.log('所有智能体信息:', results)
  } catch (error) {
    console.error('获取智能体信息失败:', error.message)
  }
}

// 顺序处理多个知识库
async function processMultipleDatabases(dbIds) {
  const results = []
  for (const dbId of dbIds) {
    try {
      const info = await knowledgeApi.getDatabaseInfo(dbId)
      results.push(info.data)
    } catch (error) {
      console.error(`获取数据库 ${dbId} 失败:`, error.message)
    }
  }
  return results
}
```

## Token缓存机制

### 缓存配置

- **缓存时间**：30分钟
- **存储位置**：浏览器localStorage
- **Token键**：`wps_ai_contract_token`
- **时间戳键**：`wps_ai_contract_token_timestamp`

### 缓存工作流程

```
请求发起
  ↓
检查localStorage中的Token
  ↓
Token存在 → 检查是否过期
  ↓                    ↓
未过期 → 使用Token    已过期 → 清空Token
  ↓                              ↓
发送请求                    检查用户凭证
                                  ↓
                            凭证存在 → 自动登录获取新Token
                                  ↓
                            使用新Token发送请求
```

## 请求拦截器流程

```
请求发起
  ↓
请求拦截器
  ↓
检查Token有效性
  ↓
无效Token → 如果有用户凭证，自动登录
  ↓
添加Authorization header
  ↓
发送HTTP请求
  ↓
后端处理
  ↓
返回响应
```

## 响应拦截器流程

```
收到HTTP响应
  ↓
响应拦截器
  ↓
检查HTTP状态码
  ↓
200状态码 → 检查响应体
  ↓              ↓
   检查detail字段（错误）
   ↓
   有 → 返回错误Promise
   ↓
   无 → 格式化响应数据
   ↓
   返回成功Response
   ↓
非200状态码 → 处理HTTP错误
  ↓           (401、403、404、500等)
  处理并返回错误Promise
```

## 错误处理

### 常见错误类型

```javascript
// 1. 网络错误
try {
  await authApi.getCurrentUser()
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    console.log('网络连接失败')
  }
}

// 2. 认证错误 (401)
try {
  await authApi.getCurrentUser()
} catch (error) {
  if (error.code === 401) {
    console.log('登录状态已过期，请重新登陆')
    // Token会自动清除，下次请求会自动重新登录
  }
}

// 3. 权限错误 (403)
try {
  await authApi.deleteUser(userId)
} catch (error) {
  if (error.code === 403) {
    console.log('您没有权限执行此操作')
  }
}

// 4. 验证错误 (422)
try {
  await knowledgeApi.createDatabase({
    database_name: '', // 错误：名称为空
    description: 'test',
    embed_model_name: 'model'
  })
} catch (error) {
  if (error.code === 422) {
    console.log('数据验证失败:', error.message)
  }
}

// 5. 业务错误
try {
  await authApi.createUser({ username: 'admin' })
} catch (error) {
  // 后端返回的错误信息
  console.log('创建用户失败:', error.message)
}
```

## 在Vue组件中使用

```vue
<template>
  <div class="dashboard">
    <h1>{{ userInfo.username }}</h1>
    <button @click="loadAgents">加载智能体</button>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="agents-list">
      <div v-for="agent in agents" :key="agent.id" class="agent-card">
        {{ agent.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authApi, chatApi } from '@/services/api'

const userInfo = ref({})
const agents = ref([])
const loading = ref(false)

onMounted(async () => {
  await loadUserInfo()
})

async function loadUserInfo() {
  try {
    const response = await authApi.getCurrentUser()
    userInfo.value = response.data
  } catch (error) {
    console.error('加载用户信息失败:', error.message)
  }
}

async function loadAgents() {
  loading.value = true
  try {
    const response = await chatApi.getAgents()
    agents.value = response.data
  } catch (error) {
    console.error('加载智能体失败:', error.message)
  } finally {
    loading.value = false
  }
}
</script>
```

## 在Composables中使用

```javascript
// useAuthApi.js
import { ref } from 'vue'
import { authApi } from '@/services/api'

export function useAuthApi() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getCurrentUser = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.getCurrentUser()
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.updateProfile(data)
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    getCurrentUser,
    updateProfile
  }
}
```

## 在其他WPS插件中使用

该请求模板是通用的，可直接复制 `request.js` 和 `api.js` 到其他WPS插件项目中使用：

1. 复制 `src/services/request.js` 和 `src/services/api.js` 到目标项目的 `src/services/` 目录
2. 在 `.env` 中配置 `VITE_API_BASE_URL`
3. 在组件中导入并使用相应的API接口

```javascript
// 在其他WPS插件中
import { authApi, knowledgeApi } from '@/services/api'

// 直接使用，无需修改
const userInfo = await authApi.getCurrentUser()
const databases = await knowledgeApi.getDatabases()
```

## 最佳实践

1. **总是处理错误**：始终使用 try-catch 捕获异常
2. **显示加载状态**：在长时间操作中显示加载指示器
3. **验证响应数据**：确保返回的数据符合预期格式
4. **避免重复请求**：使用防抖和节流防止用户多次点击
5. **合理使用缓存**：需要时手动缓存API结果以减少请求
6. **记录日志**：在开发环境中记录重要的API调用
7. **安全存储凭证**：不要在localStorage中存储敏感信息，仅在sessionStorage中临时存储

## 常见问题

**Q: Token过期后会发生什么？**
A: 系统会自动检测Token过期，如果有存储的用户凭证，会自动重新登录获取新Token。如果没有凭证，请求会失败。

**Q: 可以同时发起多个请求吗？**
A: 可以，系统支持并发请求。如果多个请求同时触发Token刷新，会使用队列机制确保只登录一次。

**Q: 如何自定义请求头？**
A: 在调用API时传入config参数：

```javascript
await request.get('/api/endpoint', {
  headers: { 'X-Custom-Header': 'value' }
})
```

**Q: 支持哪些HTTP方法？**
A: 支持 GET、POST、PUT、DELETE、上传（multipart/form-data）、下载等。

**Q: 如何禁用Token自动管理？**
A: 直接使用 `axiosInstance` 绕过拦截器：

```javascript
import { axiosInstance } from '@/services/request'
await axiosInstance.get('/api/endpoint')
```
