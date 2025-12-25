/**
 * API接口调用模块
 * 基于request.js的通用请求模板，针对WPS AI Contract的具体API进行封装
 *
 * 注意：此模块已移除所有模拟数据和测试数据的使用
 * 系统将完全依赖真实的API调用和文档内容进行处理
 */

import request, { useTokenManager } from './request'

/**
 * 认证相关接口
 */
export const authApi = {
  // 登录获取Token
  login(username, password) {
    return request.post(
      '/api/auth/token',
      new URLSearchParams({
        username,
        password,
        grant_type: 'password'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request.get('/api/auth/me')
  },

  // 更新用户资料
  updateProfile(data) {
    return request.put('/api/auth/profile', data)
  },

  // 获取用户列表
  getUserList(skip = 0, limit = 100) {
    return request.get('/api/auth/users', { skip, limit })
  },

  // 创建用户
  createUser(data) {
    return request.post('/api/auth/users', data)
  },

  // 获取用户详情
  getUserDetail(userId) {
    return request.get(`/api/auth/users/${userId}`)
  },

  // 更新用户
  updateUser(userId, data) {
    return request.put(`/api/auth/users/${userId}`, data)
  },

  // 删除用户
  deleteUser(userId) {
    return request.delete(`/api/auth/users/${userId}`)
  },

  // 验证用户名
  validateUsername(username) {
    return request.post('/api/auth/validate-username', { username })
  },

  // 检查User ID可用性
  checkUserIdAvailability(userId) {
    return request.get(`/api/auth/check-user-id/${userId}`)
  },

  // 上传用户头像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload('/api/auth/upload-avatar', formData)
  }
}

/**
 * 聊天相关接口
 */
export const chatApi = {
  // 获取默认智能体
  getDefaultAgent() {
    return request.get('/api/chat/default_agent')
  },

  // 设置默认智能体
  setDefaultAgent(agentId) {
    return request.post('/api/chat/set_default_agent', { agent_id: agentId })
  },

  // 简单问答
  call(query, meta = {}) {
    return request.post('/api/chat/call', { query, meta })
  },

  // 获取所有智能体
  getAgents() {
    return request.get('/api/chat/agent')
  },

  // 获取智能体详情
  getAgentDetail(agentId) {
    return request.get(`/api/chat/agent/${agentId}`)
  },

  // 使用智能体对话
  chatWithAgent(agentId, data) {
    console.log('[API] chatWithAgent 调用次数跟踪')
    // 添加调用计数器
    if (!window.chatWithAgentCount) window.chatWithAgentCount = 0
    window.chatWithAgentCount++
    console.log(`[API] chatWithAgent 第 ${window.chatWithAgentCount} 次调用`, agentId, data)

    // 为 /api/chat/agent/{agent_id} 请求设置10分钟超时
    return request.post(`/api/chat/agent/${agentId}`, data, {
      timeout: 600000 // 10分钟（毫秒）
    })
  },

  // 获取聊天模型列表
  getChatModels(modelProvider) {
    return request.get('/api/chat/models', { model_provider: modelProvider })
  },

  // 更新聊天模型列表
  updateChatModels(modelProvider, modelNames) {
    return request.post('/api/chat/models/update', modelNames, {
      params: { model_provider: modelProvider }
    })
  },

  // 获取可用工具
  getTools(agentId) {
    return request.get('/api/chat/tools', { agent_id: agentId })
  },

  // 恢复被中断的对话
  resumeAgentChat(agentId, data) {
    return request.post(`/api/chat/agent/${agentId}/resume`, data)
  },

  // 保存智能体配置
  saveAgentConfig(agentId, config) {
    return request.post(`/api/chat/agent/${agentId}/config`, config)
  },

  // 获取智能体配置
  getAgentConfig(agentId) {
    return request.get(`/api/chat/agent/${agentId}/config`)
  },

  // 获取智能体历史
  getAgentHistory(agentId, threadId) {
    return request.get(`/api/chat/agent/${agentId}/history`, { thread_id: threadId })
  },

  // 获取智能体状态
  getAgentState(agentId, threadId) {
    return request.get(`/api/chat/agent/${agentId}/state`, { thread_id: threadId })
  },

  // 创建对话线程
  createThread(data) {
    console.log('[API] createThread 调用次数跟踪')
    // 添加调用计数器
    if (!window.createThreadCount) window.createThreadCount = 0
    window.createThreadCount++
    console.log(`[API] createThread 第 ${window.createThreadCount} 次调用`, data)

    return request.post('/api/chat/thread', data)
  },

  // 获取用户的所有线程
  getThreads(agentId) {
    return request.get('/api/chat/threads', { agent_id: agentId })
  },

  // 删除线程
  deleteThread(threadId) {
    return request.delete(`/api/chat/thread/${threadId}`)
  },

  // 更新线程
  updateThread(threadId, data) {
    return request.put(`/api/chat/thread/${threadId}`, data)
  },

  // 上传线程附件
  uploadAttachment(threadId, file) {
    console.log('[API] uploadAttachment 调用次数跟踪')
    // 添加调用计数器
    if (!window.uploadAttachmentCount) window.uploadAttachmentCount = 0
    window.uploadAttachmentCount++
    console.log(`[API] uploadAttachment 第 ${window.uploadAttachmentCount} 次调用`, threadId)

    const formData = new FormData()
    formData.append('file', file)
    return request.upload(`/api/chat/thread/${threadId}/attachments`, formData)
  },

  // 获取线程附件列表
  getAttachments(threadId) {
    return request.get(`/api/chat/thread/${threadId}/attachments`)
  },

  // 删除线程附件
  deleteAttachment(threadId, fileId) {
    return request.delete(`/api/chat/thread/${threadId}/attachments/${fileId}`)
  },

  // 提交消息反馈
  submitMessageFeedback(messageId, data) {
    return request.post(`/api/chat/message/${messageId}/feedback`, data)
  },

  // 获取消息反馈
  getMessageFeedback(messageId) {
    return request.get(`/api/chat/message/${messageId}/feedback`)
  },

  // 上传图片
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload('/api/chat/image/upload', formData)
  },

  // 完整的AI财务报表分析：创建线程 -> 上传附件 -> 发起对话
  async startCompleteReview(username, password, contractFile, prompt = '') {
    try {
      // 硬编码用户名和密码
      username = 'hetongshenhe'
      password = 'Abcd112233'

      console.log('[财务分析] 使用硬编码凭证进行登录...')
      let token = null

      // 检查是否有有效的Token
      const tokenManager = useTokenManager()
      if (tokenManager.hasValidToken()) {
        token = tokenManager.getToken()
        console.log('[步骤一] 使用现有Token')
      } else {
        // 如果没有有效Token，则登录获取
        console.log('[步骤一] 开始登录...')
        const loginResult = await this.login(username, password)
        console.log('[步骤一] 登录响应:', loginResult)

        // 从响应中获取token
        // 响应拦截器返回格式: { success: true, code: 200, data: { access_token, ... } }
        const loginData = loginResult?.data || loginResult
        token = loginData?.access_token

        if (!token) {
          console.error('[步骤一] 无法从登录响应中提取token，响应:', loginResult)
          throw new Error(`登录失败，无法获取Token。响应: ${JSON.stringify(loginResult)}`)
        }

        // **关键：保存Token到本地存储，以便后续请求拦截器使用**
        tokenManager.setToken(token)
        console.log('[步骤一] Token已保存到本地存储，长度:', token.length)
        console.log('[步骤一] 登录成功，获得Token')
      }

      // 步骤二：创建对话线程
      console.log('[步骤二] 开始创建对话线程...')
      const threadResult = await this.createThread({
        title: contractFile.name || '合同审核',
        agent_id: 'FinancialReportAgent'
      })
      // 兼容 id 可能在 threadResult 或 threadResult.data 中
      const threadId = threadResult?.id || threadResult?.data?.id
      if (!threadId) {
        throw new Error('创建对话线程失败')
      }
      console.log(`[步骤二] 对话线程创建成功，threadId: ${threadId}`)

      // 步骤三：上传文档附件
      console.log('[步骤三] 开始上传文档附件...')
      console.log('[步骤三] 上传文件类型:', contractFile?.constructor?.name)
      console.log('[步骤三] 上传文件名:', contractFile?.name)
      console.log('[步骤三] 上传文件大小:', contractFile?.size)

      // 关键：contractFile必须是File对象，而不是Blob
      // 如果是Blob，需要转换为File对象
      let fileToUpload = contractFile

      if (contractFile instanceof Blob && !(contractFile instanceof File)) {
        console.log('[步骤三] 检测到Blob对象，需要转换为File')
        // 将Blob转换为File对象
        // 关键：确保文件名总是有.pdf扩展名，否则服务器无法识别
        let fileName = contractFile.name || 'document.pdf'
        if (!fileName.endsWith('.pdf')) {
          fileName = fileName + '.pdf'
        }
        fileToUpload = new File([contractFile], fileName, {
          type: 'application/pdf'
        })
        console.log('[步骤三] 已转换成File对象，文件名:', fileName)
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)
      console.log('[步骤三] FormData已准备，开始上传...')

      // 直接调用 request.upload 上传表单
      const attachmentResult = await request.upload(
        `/api/chat/thread/${threadId}/attachments`,
        formData
      )
      // 兼容多种字段名：id、file_id、fileId 或在 attachmentResult.data 中
      const fileId =
        attachmentResult?.id ||
        attachmentResult?.file_id ||
        attachmentResult?.fileId ||
        attachmentResult?.data?.id ||
        attachmentResult?.data?.file_id ||
        attachmentResult?.data?.fileId
      if (!fileId) {
        console.error('上传响应结果:', attachmentResult)
        throw new Error('上传附件失败：无法获取文件ID')
      }
      console.log(`[步骤三] 文档附件上传成功，fileId: ${fileId}`)
      console.log('[步骤四] 开始发起智能体对话...')
      let reviewResult

      // 彻底移除测试数据判断，始终使用真实API
      console.log('[步骤四] 彻底移除测试数据判断，始终调用真实AI接口')

      console.log('[步骤四] 调用真实AI接口:', {
        agentId: 'FinancialReportAgent',
        threadId: threadId,
        promptLength: prompt?.length || 0
      })

      // 添加更多调试信息
      console.log('[步骤四] 发送给AI的完整提示词:', prompt)

      reviewResult = await this.chatWithAgent('FinancialReportAgent', {
        query: prompt,
        config: {
          thread_id: threadId
        }
      })

      console.log('[步骤四] AI接口调用完成，返回结果类型:', typeof reviewResult)
      if (reviewResult && typeof reviewResult === 'object') {
        console.log('[步骤四] AI接口返回结果字段:', Object.keys(reviewResult))
      }

      console.log('[步骤四] 智能体对话请求完成')

      // 返回完整的流程结果
      return {
        success: true,
        token,
        threadId,
        attachmentId: fileId,
        reviewResult,
        message: '完整的AI审核流程执行成功'
      }
    } catch (error) {
      console.error('AI审核流程执行失败:', error)
      return {
        success: false,
        error: error.message || '执行流程过程中出错',
        message: error.message || '执行流程过程中出错'
      }
    }
  },

  // 单独的登录接口（用于startCompleteReview）
  login(username, password) {
    return authApi.login(username, password)
  }
}

/**
 * 知识库相关接口
 */
export const knowledgeApi = {
  // 获取所有知识库
  getDatabases() {
    return request.get('/api/knowledge/databases')
  },

  // 创建知识库
  createDatabase(data) {
    return request.post('/api/knowledge/databases', data)
  },

  // 获取知识库详情
  getDatabaseInfo(dbId) {
    return request.get(`/api/knowledge/databases/${dbId}`)
  },

  // 更新知识库信息
  updateDatabaseInfo(dbId, data) {
    return request.put(`/api/knowledge/databases/${dbId}`, data)
  },

  // 删除知识库
  deleteDatabase(dbId) {
    return request.delete(`/api/knowledge/databases/${dbId}`)
  },

  // 导出知识库
  exportDatabase(dbId, format = 'csv', includeVectors = false) {
    return request.download(`/api/knowledge/databases/${dbId}/export`, {
      format,
      include_vectors: includeVectors
    })
  },

  // 添加文档
  addDocuments(dbId, data) {
    return request.post(`/api/knowledge/databases/${dbId}/documents`, data)
  },

  // 获取文档详情
  getDocumentInfo(dbId, docId) {
    return request.get(`/api/knowledge/databases/${dbId}/documents/${docId}`)
  },

  // 删除文档
  deleteDocument(dbId, docId) {
    return request.delete(`/api/knowledge/databases/${dbId}/documents/${docId}`)
  },

  // 获取文档基本信息
  getDocumentBasicInfo(dbId, docId) {
    return request.get(`/api/knowledge/databases/${dbId}/documents/${docId}/basic`)
  },

  // 获取文档内容
  getDocumentContent(dbId, docId) {
    return request.get(`/api/knowledge/databases/${dbId}/documents/${docId}/content`)
  },

  // 重新分块文档
  rechunkDocuments(dbId, data) {
    return request.post(`/api/knowledge/databases/${dbId}/documents/rechunks`, data)
  },

  // 下载文档
  downloadDocument(dbId, docId) {
    return request.download(`/api/knowledge/databases/${dbId}/documents/${docId}/download`)
  },

  // 查询知识库
  queryDatabase(dbId, data) {
    return request.post(`/api/knowledge/databases/${dbId}/query`, data)
  },

  // 测试查询
  testQuery(dbId, data) {
    return request.post(`/api/knowledge/databases/${dbId}/query-test`, data)
  },

  // 获取查询参数
  getQueryParams(dbId) {
    return request.get(`/api/knowledge/databases/${dbId}/query-params`)
  },

  // 更新查询参数
  updateQueryParams(dbId, params) {
    return request.put(`/api/knowledge/databases/${dbId}/query-params`, params)
  },

  // 生成测试问题
  generateSampleQuestions(dbId, count = 5) {
    return request.post(`/api/knowledge/databases/${dbId}/sample-questions`, { count })
  },

  // 获取测试问题
  getSampleQuestions(dbId) {
    return request.get(`/api/knowledge/databases/${dbId}/sample-questions`)
  },

  // 上传文件
  uploadFile(file, dbId = null, allowJsonl = false) {
    const formData = new FormData()
    formData.append('file', file)
    const config = {
      params: { allow_jsonl: allowJsonl }
    }
    if (dbId) config.params.db_id = dbId
    return request.upload('/api/knowledge/files/upload', formData, null)
  },

  // 获取支持的文件类型
  getSupportedFileTypes() {
    return request.get('/api/knowledge/files/supported-types')
  },

  // 文件转Markdown
  markItDown(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload('/api/knowledge/files/markdown', formData)
  },

  // 获取知识库类型
  getKnowledgeTypes() {
    return request.get('/api/knowledge/types')
  },

  // 获取知识库统计
  getKnowledgeStats() {
    return request.get('/api/knowledge/stats')
  },

  // 获取Embedding模型状态
  getEmbeddingModelStatus(modelId) {
    return request.get(`/api/knowledge/embedding-models/${modelId}/status`)
  },

  // 获取所有Embedding模型状态
  getAllEmbeddingModelsStatus() {
    return request.get('/api/knowledge/embedding-models/status')
  },

  // 生成描述
  generateDescription(name, currentDescription = '') {
    return request.post('/api/knowledge/generate-description', {
      name,
      current_description: currentDescription
    })
  }
}

/**
 * 系统相关接口
 */
export const systemApi = {
  // 健康检查
  healthCheck() {
    return request.get('/api/system/health')
  },

  // 获取系统配置
  getConfig() {
    return request.get('/api/system/config')
  },

  // 更新单个配置
  updateConfig(key, value) {
    return request.post('/api/system/config', { key, value })
  },

  // 批量更新配置
  updateConfigBatch(configs) {
    return request.post('/api/system/config/update', configs)
  },

  // 获取系统日志
  getSystemLogs() {
    return request.get('/api/system/logs')
  },

  // 获取系统信息
  getSystemInfo() {
    return request.get('/api/system/info')
  },

  // 重新加载信息配置
  reloadInfoConfig() {
    return request.post('/api/system/info/reload', {})
  },

  // 获取OCR统计
  getOcrStats() {
    return request.get('/api/system/ocr/stats')
  },

  // 检查OCR服务
  checkOcrServices() {
    return request.get('/api/system/ocr/health')
  },

  // 获取聊天模型状态
  getChatModelStatus(provider, modelName) {
    return request.get('/api/system/chat-models/status', { provider, model_name: modelName })
  },

  // 获取所有聊天模型状态
  getAllChatModelsStatus() {
    return request.get('/api/system/chat-models/all/status')
  },

  // 获取自定义供应商
  getCustomProviders() {
    return request.get('/api/system/custom-providers')
  },

  // 添加自定义供应商
  addCustomProvider(data) {
    return request.post('/api/system/custom-providers', data)
  },

  // 更新自定义供应商
  updateCustomProvider(providerId, data) {
    return request.put(`/api/system/custom-providers/${providerId}`, data)
  },

  // 删除自定义供应商
  deleteCustomProvider(providerId) {
    return request.delete(`/api/system/custom-providers/${providerId}`)
  },

  // 测试自定义供应商
  testCustomProvider(providerId, data) {
    return request.post(`/api/system/custom-providers/${providerId}/test`, data)
  }
}

/**
 * 仪表板相关接口
 */
export const dashboardApi = {
  // 获取所有对话
  getAllConversations(params = {}) {
    return request.get('/api/dashboard/conversations', params)
  },

  // 获取对话详情
  getConversationDetail(threadId) {
    return request.get(`/api/dashboard/conversations/${threadId}`)
  },

  // 获取用户活跃度统计
  getUserActivityStats() {
    return request.get('/api/dashboard/stats/users')
  },

  // 获取工具调用统计
  getToolCallStats() {
    return request.get('/api/dashboard/stats/tools')
  },

  // 获取知识库统计
  getKnowledgeStats() {
    return request.get('/api/dashboard/stats/knowledge')
  },

  // 获取智能体分析
  getAgentAnalytics() {
    return request.get('/api/dashboard/stats/agents')
  },

  // 获取仪表板统计
  getDashboardStats() {
    return request.get('/api/dashboard/stats')
  },

  // 获取所有反馈
  getAllFeedbacks(params = {}) {
    return request.get('/api/dashboard/feedbacks', params)
  },

  // 获取时间序列统计
  getCallTimeseriesStats(type = 'models', timeRange = '14days') {
    return request.get('/api/dashboard/stats/calls/timeseries', { type, time_range: timeRange })
  }
}

/**
 * 评估相关接口
 */
export const evaluationApi = {
  // 获取评估基准
  getEvaluationBenchmark(dbId, benchmarkId, page = 1, pageSize = 10) {
    return request.get(`/api/evaluation/databases/${dbId}/benchmarks/${benchmarkId}`, {
      page,
      page_size: pageSize
    })
  },

  // 删除评估基准
  deleteEvaluationBenchmark(benchmarkId) {
    return request.delete(`/api/evaluation/benchmarks/${benchmarkId}`)
  },

  // 获取评估结果
  getEvaluationResults(dbId, taskId, page = 1, pageSize = 20, errorOnly = false) {
    return request.get(`/api/evaluation/databases/${dbId}/results/${taskId}`, {
      page,
      page_size: pageSize,
      error_only: errorOnly
    })
  },

  // 删除评估结果
  deleteEvaluationResult(dbId, taskId) {
    return request.delete(`/api/evaluation/databases/${dbId}/results/${taskId}`)
  },

  // 上传评估基准
  uploadEvaluationBenchmark(dbId, file, name, description = '') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    return request.upload(`/api/evaluation/databases/${dbId}/benchmarks/upload`, formData)
  },

  // 获取评估基准列表
  getEvaluationBenchmarks(dbId) {
    return request.get(`/api/evaluation/databases/${dbId}/benchmarks`)
  },

  // 生成评估基准
  generateEvaluationBenchmark(dbId, params) {
    return request.post(`/api/evaluation/databases/${dbId}/benchmarks/generate`, params)
  },

  // 运行评估
  runEvaluation(dbId, params) {
    return request.post(`/api/evaluation/databases/${dbId}/run`, params)
  },

  // 获取评估历史
  getEvaluationHistory(dbId) {
    return request.get(`/api/evaluation/databases/${dbId}/history`)
  }
}

/**
 * 思维导图相关接口
 */
export const mindmapApi = {
  // 获取知识库文件列表
  getDatabaseFiles(dbId) {
    return request.get(`/api/mindmap/databases/${dbId}/files`)
  },

  // 生成思维导图
  generateMindmap(data) {
    return request.post('/api/mindmap/generate', data)
  },

  // 获取知识库概览
  getDatabasesOverview() {
    return request.get('/api/mindmap/databases')
  },

  // 获取知识库思维导图
  getDatabaseMindmap(dbId) {
    return request.get(`/api/mindmap/database/${dbId}`)
  },

  // 保存知识库思维导图
  saveDatabaseMindmap(dbId, mindmap) {
    return request.post(`/api/mindmap/database/${dbId}`, mindmap)
  }
}

/**
 * 知识图谱相关接口
 */
export const graphApi = {
  // 获取知识图谱列表
  getGraphs() {
    return request.get('/api/graph/list')
  },

  // 获取子图
  getSubgraph(dbId, nodeLabel = '*', maxDepth = 2, maxNodes = 100) {
    return request.get('/api/graph/subgraph', {
      db_id: dbId,
      node_label: nodeLabel,
      max_depth: maxDepth,
      max_nodes: maxNodes
    })
  },

  // 获取图谱标签
  getGraphLabels(dbId) {
    return request.get('/api/graph/labels', { db_id: dbId })
  },

  // 获取图谱统计
  getGraphStats(dbId) {
    return request.get('/api/graph/stats', { db_id: dbId })
  },

  // 获取Neo4j信息
  getNeo4jInfo() {
    return request.get('/api/graph/neo4j/info')
  },

  // 为Neo4j索引实体
  indexNeo4jEntities(data = {}) {
    return request.post('/api/graph/neo4j/index-entities', data)
  },

  // 添加Neo4j实体
  addNeo4jEntities(filePath, kgdbName = null) {
    return request.post('/api/graph/neo4j/add-entities', {
      file_path: filePath,
      kgdb_name: kgdbName
    })
  }
}

/**
 * 额外工具函数
 */

/**
 * 导航到指定位置
 * @param {number} page - 页码
 * @param {number} line - 行号
 * @param {string} text - 要定位的文本内容
 */
export async function navigateToPosition(page, line, text) {
  console.log(`[导航] 尝试导航到第${page}页第${line}行`)
  if (text) {
    console.log(`[导航] 定位文本: ${text.substring(0, 50)}...`) // 只显示前50个字符
  }

  // 检测是否在WPS环境中
  const isInWPS = typeof window !== 'undefined' && window.Application

  if (!isInWPS) {
    console.log('[导航] 当前不在WPS环境中，使用开发环境模拟')

    // 在开发环境中，显示通知提示用户
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `
    notification.textContent = `已定位到第${page}页第${line}行`

    document.body.appendChild(notification)

    // 3秒后自动移除通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)

    // 在开发环境中也模拟高亮效果（如果可能的话）
    try {
      // 如果在浏览器环境中，尝试通过某种方式模拟高亮
      console.log('[导航] 开发环境中模拟高亮效果')
    } catch (simError) {
      console.warn('[导航] 开发环境中模拟高亮效果失败:', simError)
    }

    return
  }

  console.log('[导航] 检测到WPS环境，开始执行导航')

  const doc = window.Application.ActiveDocument
  if (!doc) {
    console.warn('[导航] 未找到活跃文档')
    return
  }

  console.log('[导航] 获取到活跃文档')

  // 使用WPS的GoTo方法直接跳转到指定页和行
  // WPS的GoTo方法参数：(What, Which, Count, Name)
  // What: 1表示页，2表示行
  try {
    console.log(`[导航] 使用WPS GoTo方法跳转到第${page}页`)
    // 先跳转到指定页
    window.Application.Selection.GoTo(1, 1, page) // 1=页, 1=绝对位置, page=页码

    // 再跳转到指定行（相对于当前页）
    console.log(`[导航] 使用WPS GoTo方法跳转到第${line}行`)
    window.Application.Selection.MoveDown(5, line - 1) // 5=单位(行), line-1=移动行数

    console.log(`[导航] 成功导航到第${page}页第${line}行`)
    // 注意：不在导航时添加高亮和批注
    // 高亮和批注仅在初审时添加，插入建议时删除
    // 此处仅负责文档定位功能
    return
  } catch (gotoError) {
    console.warn('[导航] 使用GoTo方法失败:', gotoError)
  }

  // 如果GoTo方法失败，使用备选方案
  console.log('[导航] 使用备选方案进行导航')

  // 获取文档内容
  const docRange = doc.Range()
  if (!docRange) {
    console.warn('[导航] 无法获取文档范围')
    return
  }

  console.log('[导航] 获取到文档范围')

  // 查找所有段落
  const paragraphs = doc.Paragraphs
  if (!paragraphs) {
    console.warn('[导航] 无法获取段落集合')
    return
  }

  console.log(`[导航] 获取到段落集合，总数: ${paragraphs.Count}`)

  // 尝试通过页码和行号直接定位
  try {
    // 遍历段落，尝试找到对应页码的内容
    for (let i = 1; i <= paragraphs.Count; i++) {
      const para = paragraphs.Item(i)
      if (!para) continue

      const paraRange = para.Range
      if (!paraRange) continue

      // 获取段落所在的页码
      try {
        const paraPage = doc.Range(1, paraRange.Start).Information(3) // 3表示页号
        console.log(`[导航] 段落${i}位于第${paraPage}页`)

        if (paraPage === page) {
          // 找到目标页，现在需要定位到具体行
          console.log(`[导航] 找到第${page}页，开始定位到第${line}行`)

          // 选中段落
          paraRange.Select()

          // 移动到指定行
          window.Application.Selection.MoveDown(5, line - 1) // 5=单位(行)

          console.log(`[导航] 成功导航到第${page}页第${line}行`)
          // 注意：不在导航时添加高亮和批注
          // 高亮和批注仅在初审时添加，插入建议时删除
          // 此处仅负责文档定位功能
          return
        }
      } catch (pageError) {
        console.warn(`[导航] 获取段落${i}页码失败:`, pageError)
      }
    }
  } catch (error) {
    console.warn('[导航] 通过页码和行号定位失败:', error)
  }

  console.warn(`[导航] 未找到第${page}页第${line}行的位置`)
} // 关闭 navigateToPosition 函数

/**
 * 调用二次审核接口
 * @param {string} documentContent - 合同文档内容
 * @param {Array} rejectedItems - 被标记为误判的风险项
 * @returns {Promise} 二审结果
 */
export const callSecondReview = async (documentContent, rejectedItems) => {
  try {
    // 清理rejectedItems中的WPS代理对象，留下字段信息
    const cleanedRejectedItems = rejectedItems.map((item) => ({
      id: item.id,
      riskName: item.riskName,
      riskLevel: item.riskLevel,
      matchDegree: item.matchDegree,
      riskContent: item.riskContent,
      riskDetail: item.riskDetail,
      suggestedEdit: item.suggestedEdit,
      status: item.status,
      userReason: item.userReason,
      userSuggestion: item.userSuggestion
      // 注意：不沅包position字段，因为position中可能包含WPS Range对象，不能序列化
    }))

    // 构建二审请求
    const secondReviewPrompt = `基于以下被标记为误判的风险项，进行二次审核确认：

误判项目:
${JSON.stringify(cleanedRejectedItems, null, 2)}

原始合同内容:
${documentContent}`

    // 调用二审接口（使用智能体对话）
    const result = await chatApi.call(secondReviewPrompt)

    if (result && result.data) {
      // 解析二审结果
      const responseData = result.data
      if (responseData.response && responseData.response.riskItems) {
        return {
          riskItems: responseData.response.riskItems || [],
          riskScore: responseData.response.riskScore || 0,
          contractType: responseData.response.contractType || '',
          riskStatistics: responseData.response.riskStatistics || {
            high: 0,
            medium: 0,
            low: 0
          }
        }
      }
    }

    throw new Error('二审结果格式异常')
  } catch (error) {
    console.error('二审接口调用失败:', error)
    throw error
  }
}

/**
 * 任务相关接口
 */
export const tasksApi = {
  // 获取任务列表
  listTasks(status = null, limit = 100) {
    const params = { limit }
    if (status) params.status = status
    return request.get('/api/tasks', params)
  },

  // 获取单个任务
  getTask(taskId) {
    return request.get(`/api/tasks/${taskId}`)
  },

  // 取消任务
  cancelTask(taskId) {
    return request.post(`/api/tasks/${taskId}/cancel`, {})
  }
}
