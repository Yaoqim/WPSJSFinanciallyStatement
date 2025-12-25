<template>
  <div class="financial-analysis">
    <!-- 标题 -->
    <div class="header">
      <h2>📊 AI财报分析</h2>
      <p class="subtitle">智能分析每份PDF财报，生成专业分析报告</p>
    </div>

    <!-- PDF上传区域 - 已移除，改为直接获取当前PDF -->
    <!-- 如果需要手动上传，可以显示上传框 -->

    <!-- 分析按钮 -->
    <div class="action-section" v-if="analysisData">
      <button class="btn-primary" @click="onStartAnalysis" :disabled="isAnalyzing">
        {{ analysisButtonText }}
      </button>
    </div>

    <!-- 导出按钮 -->
    <div class="export-section" v-if="analysisData">
      <button class="btn-secondary" @click="onExportExcel" :disabled="!analysisData">
        📄 导出Excel数据
      </button>
      <button class="btn-secondary" @click="onExportReport" :disabled="!analysisData">
        📚 导出分析报告
      </button>
    </div>

    <!-- 状态提示 -->
    <div class="status-section" v-if="statusMessage">
      <div :class="['status-message', statusType]">
        {{ statusMessage }}
      </div>
    </div>

    <!-- 分析结果显示 -->
    <div class="results-section" v-if="analysisData && analysisResults">
      <div class="results-box">
        <h3>📈 分析结果</h3>
        <pre class="results-content">{{ JSON.stringify(analysisResults, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { chatApi } from '../services/api'

export default {
  name: 'FinancialAnalysisTaskPane',
  data() {
    return {
      analysisButtonText: '开始/重新分析当前PDF财报',
      statusMessage: '',
      statusType: 'info',
      analysisData: null,
      analysisResults: null,
      isAnalyzing: false,
      isUploading: false,
      uploadProgress: 0,
      isDragging: false,
      pdfFile: null,
      excelData: null,
      markdownContent: null
    }
  },
  mounted() {
    // 页面加载时，尝试从当前浏览器标签页获取PDF文件
    console.log('[TaskPane] 组件已挂载，尝试获取当前PDF文件...')
    this.fetchCurrentPdfFile()
  },
  methods: {
    /**
     * 从当前浏览器标签页获取PDF文件
     * 用户从PDF页面点击插件菜单打开该应用时，应自动获取当前PDF
     */
    async fetchCurrentPdfFile() {
      try {
        console.log('[TaskPane] 正在获取当前PDF文件...')

        // 从sessionStorage获取PDF数据（由content-script提供）
        const pdfBase64 = sessionStorage.getItem('currentPdfBase64')
        const pdfUrl = sessionStorage.getItem('currentPdfUrl') || window.location.href

        if (pdfBase64) {
          // **优先使用base64数据（将真实文件内容从 content-script 传递过来）**
          console.log('[TaskPane] 找到sessionStorage中的PDF base64数据')

          // base64回复为ArrayBuffer
          const binaryString = atob(pdfBase64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          const arrayBuffer = bytes.buffer
          const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' })

          // 批取文件名（确保扩展名）
          let fileName = pdfUrl.split('/').pop() || 'document.pdf'
          fileName = fileName.split('?')[0]
          if (!fileName.endsWith('.pdf')) {
            fileName = fileName + '.pdf'
          }

          // 创建 File 对象
          this.pdfFile = new File([pdfBlob], fileName, {
            type: 'application/pdf',
            lastModified: Date.now()
          })

          this.analysisData = {
            agent_id: 'FinancialReportAgent',
            fileName: fileName,
            fileSize: arrayBuffer.byteLength,
            uploadTime: new Date().toLocaleString()
          }

          this.statusMessage = `已获取PDF: ${fileName} (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB)`
          this.statusType = 'success'
          console.log('[TaskPane] 成功从 base64 恢复PDF File 对象')
          return
        }

        // 改残：如果找不到base64，使用fetch下载作为备选
        console.log('[TaskPane] 找不到PDF base64，使用fetch下载')
        if (!pdfUrl) {
          throw new Error('没有检测到PDF文件')
        }

        const response = await fetch(pdfUrl)
        if (!response.ok) {
          throw new Error(`获取PDF失败: ${response.statusText}`)
        }

        const pdfBlob = await response.blob()
        let fileName = pdfUrl.split('/').pop() || 'document.pdf'
        fileName = fileName.split('?')[0]
        if (!fileName.endsWith('.pdf')) {
          fileName = fileName + '.pdf'
        }

        this.pdfFile = new File([pdfBlob], fileName, {
          type: 'application/pdf',
          lastModified: Date.now()
        })

        this.analysisData = {
          agent_id: 'FinancialReportAgent',
          fileName: fileName,
          fileSize: pdfBlob.size,
          uploadTime: new Date().toLocaleString()
        }

        this.statusMessage = `已获取PDF: ${fileName} (${(pdfBlob.size / 1024 / 1024).toFixed(2)}MB)`
        this.statusType = 'success'

        console.log('[TaskPane] 成功获取PDF文件:', fileName)
      } catch (error) {
        console.warn('[TaskPane] 获取PDF失败:', error)
        this.statusMessage = `获取PDF失败: ${error.message}`
        this.statusType = 'error'
      }
    },

    /**
     * 触发文件输入框
     */
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    /**
     * 处理文件选择
     */
    handleFileSelect(event) {
      const files = event.target.files
      if (files && files.length > 0) {
        this.processFile(files[0])
      }
    },

    /**
     * 处理拖拽文件
     */
    handleFileDrop(event) {
      this.isDragging = false
      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        this.processFile(files[0])
      }
    },

    /**
     * 处理PDF文件
     */
    processFile(file) {
      // 验证文件类型
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        this.statusMessage = '错误：仅支持PDF文件'
        this.statusType = 'error'
        return
      }

      // 验证文件大小（50MB）
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        this.statusMessage = `错误：文件过大，最大支持50MB`
        this.statusType = 'error'
        return
      }

      // 保存文件并上传
      this.pdfFile = file
      this.uploadPDF(file)
    },

    /**
     * 上传PDF文件到后端
     */
    async uploadPDF(file) {
      try {
        this.isUploading = true
        this.uploadProgress = 0
        this.statusMessage = '正在上传PDF文件...'
        this.statusType = 'info'

        // 使用FormData上传文件
        const formData = new FormData()
        formData.append('file', file)
        formData.append('agent_id', 'FinancialReportAgent')

        // 模拟上传进度
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          this.uploadProgress = i
        }

        this.analysisData = {
          agent_id: 'FinancialReportAgent',
          fileName: file.name,
          fileSize: file.size,
          uploadTime: new Date().toLocaleString()
        }

        this.statusMessage = 'PDF上传成功，点击"开始分析"事白市场'
        this.statusType = 'success'
        this.isUploading = false
      } catch (error) {
        this.statusMessage = `上传失败: ${error.message}`
        this.statusType = 'error'
        this.isUploading = false
      }
    },

    /**
     * 开始/重新分析当前PDF财报
     * 会调用4个接口：
     * 1. 提取PDF数据
     * 2. 解析财务信息
     * 3. AI分析
     * 4. 接收结果
     * agent_id 固定为: FinancialReportAgent
     */
    async onStartAnalysis() {
      try {
        this.isAnalyzing = true
        this.statusMessage = '正在分析财报...'
        this.statusType = 'info'

        if (!this.pdfFile) {
          throw new Error('没有选择PDF文件')
        }

        console.log('[TaskPane] 开始调用startCompleteReview...')

        // 提示词策略:
        // 第一部分（用于Excel的JSON结构）
        const excelPromptPart = `
你是一个专业的财务分析专家。
介绍介绍文档中的财务指标，输出一个JSON格式，包含：
{
  "company_name": "公司名称",
  "report_period": "报告期间",
  "financial_indicators": [
    {
      "indicator": "指标名称",
      "value": 数值,
      "unit": "单位",
      "yoy_growth": "同比增长率"
    }
  ],
  "key_metrics": {
    "revenue": "营收",
    "profit": "利润",
    "margin": "比率"
  },
  "analysis_summary": "汇总需要的指标"
}
`

        // 第二部分（用于Markdown文档）
        const markdownPromptPart = `
你是一个专业的财务分析专家。
根据下列提示，用Markdown格式输出详细的财抡分析报告：

1. 企业概况 - 介绍输入的企业基本信息
2. 收入分析 - 详细的财务指标分析
3. 主要驱动因素 - 业縺成长的官键因素
4. 风险警示 - 输出子坩-疏隙打万世家家有之-regexp
5. 谋上竖亽 - 投资、业务发展建议

供整整的潮漁流程Markdown内容，仅作正文，没有一一抄写数据例子。
`

        // 组合基本提示词和两部分
        const systemPrompt = `你是一个专业的财务分析AI。你将为用户提供：
1. 一个JSON格式的Excel数据
2. 一个Markdown格式的详细分析报告

详轮提示词：
沿徒:
${excelPromptPart}

Markdown:
${markdownPromptPart}
`

        console.log('[TaskPane] 提示词求根（ruit）:', systemPrompt.substring(0, 100) + '...')

        // 调用startCompleteReview，传入PDF文件和提示词
        const result = await chatApi.startCompleteReview(
          'admin', // username
          'admin', // password
          this.pdfFile, // PDF文件
          systemPrompt // 提示词
        )

        console.log('[TaskPane] startCompleteReview结果:', result)

        if (result.success && result.reviewResult) {
          // 接收且解析哨误结果
          // 数器分氩：重新解析哨误结果中的excel数据和markdown文梈
          const aiResponse = result.reviewResult?.response || ''
          console.log('[TaskPane] AI哨误:', aiResponse.substring(0, 200))

          // 下壳：会编稿提示词沿创传收中文文本中的JSON和Markdown
          // 例子（供测试）：可能需要悬测解析逻辑
          this.analysisResults = {
            status: 'success',
            message: '分析完成',
            data: result.reviewResult
          }

          // 从哨误中提取Excel数据（需要解析JSON部分）
          try {
            // 正常情况下，AI会返回一个混和文本及 JSON的音新提示词
            // 下壳亊第一个JSON块作为Excel数据
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              this.excelData = JSON.parse(jsonMatch[0])
              console.log('[TaskPane] 提取的Excel数据:', this.excelData)
            }
          } catch (parseError) {
            console.warn('[TaskPane] 不能解析Excel数据:', parseError)
          }

          // 从哨误中提取Markdown文梈（此为打券次）
          // 这里没有悬测提取Markdown的优雅氛析轨道
          // 不叫提取了，而是直接存储AI回复整个了
          this.markdownContent = aiResponse
          console.log('[TaskPane] Markdown内容长度:', this.markdownContent.length)
        } else {
          throw new Error(result.error || '分析失败')
        }

        this.statusMessage = '分析完成！'
        this.statusType = 'success'
      } catch (error) {
        console.error('[TaskPane] 分析错误:', error)
        this.statusMessage = `错误: ${error.message}`
        this.statusType = 'error'
      } finally {
        this.isAnalyzing = false
      }
    },

    /**
     * 导出Excel数据
     */
    async onExportExcel() {
      try {
        if (!this.analysisData || !this.excelData) {
          this.statusMessage = '警告：需要先上传并分析PDF'
          this.statusType = 'warning'
          return
        }

        this.statusMessage = '正在导出Excel...'
        this.statusType = 'info'

        // 解析Excel数据（从分析结果中提取）
        console.log('[TaskPane] 导出的Excel数据:', this.excelData)

        // 使用xlsx库生成Excel文件（需要npm install xlsx）
        // 这里为测试保留解析逻辑，但先不调用生成函数
        const excelContent = JSON.stringify(this.excelData, null, 2)
        console.log('[TaskPane] Excel内容已准备:', excelContent)

        // TODO: 实现真实的Excel生成和下载
        // import * as XLSX from 'xlsx'
        // const worksheet = XLSX.utils.json_to_sheet(this.excelData.financial_indicators || [])
        // const workbook = XLSX.utils.book_new()
        // XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Data')
        // XLSX.writeFile(workbook, '财报分析.xlsx')

        this.statusMessage = '导出Excel成功！（解析完成，生成待实现）'
        this.statusType = 'success'
      } catch (error) {
        console.error('[TaskPane] 导出Excel错误:', error)
        this.statusMessage = `错误: ${error.message}`
        this.statusType = 'error'
      }
    },

    /**
     * 导出分析报告
     */
    async onExportReport() {
      try {
        if (!this.analysisData || !this.markdownContent) {
          this.statusMessage = '警告：需要先上传并分析PDF'
          this.statusType = 'warning'
          return
        }

        this.statusMessage = '正在导出文档报告...'
        this.statusType = 'info'

        // 解析Markdown内容（来自AI哨误的第二部分）
        console.log('[TaskPane] 导出的Markdown内容长度:', this.markdownContent.length)
        console.log('[TaskPane] Markdown内容预览:', this.markdownContent.substring(0, 300) + '...')

        // TODO: 使用html-to-docx或marked+pdfkit生成Word/PDF文档
        // 此处为测试保留解析逻辑，但先不调用生成函数

        // 此为批判不解伙的模式，供测试
        // 使用程序上方预览的marked和html-to-docx
        // import { marked } from 'marked'
        // import { convert } from 'html-to-docx'
        // const htmlContent = marked(this.markdownContent)
        // const docxBlob = await convert({
        //   html: htmlContent,
        //   orientation: 'portrait'
        // })
        // const url = URL.createObjectURL(docxBlob)
        // const a = document.createElement('a')
        // a.href = url
        // a.download = '财报分析报告.docx'
        // a.click()

        this.statusMessage = '导出文档报告成功！（解析完成，生成待实现）'
        this.statusType = 'success'
      } catch (error) {
        console.error('[TaskPane] 导出报告错误:', error)
        this.statusMessage = `错误: ${error.message}`
        this.statusType = 'error'
      }
    }
  }
}
</script>

<style scoped>
.financial-analysis {
  padding: 20px;
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #7f8c8d;
}

/* 上传区域样式 */
.upload-section {
  margin-bottom: 20px;
}

.upload-box {
  border: 2px dashed #667eea;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: #f8f9ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #764ba2;
  background: #f0f2ff;
}

.upload-box.dragging {
  border-color: #764ba2;
  background: #e8ecff;
  transform: scale(1.02);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.upload-text .main-text {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.upload-text .sub-text {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #7f8c8d;
}

.upload-hint {
  margin: 10px 0 0 0;
  font-size: 12px;
  color: #95a5a6;
}

/* 上传进度条 */
.uploading-section {
  margin-bottom: 20px;
}

.progress-box {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
}

.progress-bar {
  background: #e0e0e0;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
}

/* 分析和导出按钮 */
.action-section {
  margin-bottom: 20px;
}

.btn-primary {
  display: block;
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.export-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-secondary {
  flex: 1;
  padding: 10px 16px;
  background: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #d5dbde;
  border-color: #a9afb5;
}

.btn-secondary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 状态提示 */
.status-section {
  margin-top: 20px;
}

.status-message {
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.status-message.info {
  background: #e3f2fd;
  color: #1976d2;
  border-left: 4px solid #1976d2;
}

.status-message.success {
  background: #e8f5e9;
  color: #388e3c;
  border-left: 4px solid #388e3c;
}

.status-message.warning {
  background: #fff3e0;
  color: #f57c00;
  border-left: 4px solid #f57c00;
}

.status-message.error {
  background: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
}

/* 分析结果显示 */
.results-section {
  margin-top: 20px;
}

.results-box {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.results-box h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #2c3e50;
}

.results-content {
  margin: 0;
  padding: 12px;
  background: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
}
</style>
