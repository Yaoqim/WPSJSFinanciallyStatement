// 内容脚本 - 注入到网页中

;(function () {
  // 检查当前页面是否是PDF
  function isPDFPage() {
    return (
      document.contentType === 'application/pdf' ||
      window.location.pathname.endsWith('.pdf') ||
      document.querySelector('embed[type="application/pdf"]') ||
      document.querySelector('iframe[src*=".pdf"]')
    )
  }

  // 如果是PDF页面，添加事件监听
  if (isPDFPage()) {
    document.addEventListener('contextmenu', () => {
      console.log('[AI财报] 检测到PDF页面')
    })
  }

  // 监听来自background script的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkPDF') {
      sendResponse({ isPDF: isPDFPage() })
    } else if (request.action === 'showAnalyzer') {
      console.log('[AI财报] 收到显示分析器的消息')

      // **关键改进：直接从background.js获取base64数据**
      // background.js已经用service worker权限读取了PDF文件
      if (request.pdfBase64) {
        console.log('[AI财报] 从background.js接收到base64数据，长度:', request.pdfBase64.length)
        sessionStorage.setItem('currentPdfBase64', request.pdfBase64)
      } else if (request.pdfError) {
        console.warn('[AI财报] background.js读取PDF失败:', request.pdfError)
      }

      if (request.pdfUrl) {
        console.log('[AI财报] 保存PDF URL:', request.pdfUrl)
        sessionStorage.setItem('currentPdfUrl', request.pdfUrl)
      }

      showAnalyzerSidebar()
      sendResponse({ status: 'shown' })
    }
  })

  // 显示分析器侧边栏
  function showAnalyzerSidebar() {
    // 检查是否已经存在侧边栏
    if (document.getElementById('ai-analyzer-sidebar')) {
      console.log('[AI财报] 侧边栏已存在')
      return
    }

    console.log('[AI财报] 创建侧边栏')

    // 调整body布局，为侧边栏预留空间
    document.body.style.margin = '0'
    document.body.style.overflow = 'hidden'

    // 创建侧边栏容器
    const sidebar = document.createElement('div')
    sidebar.id = 'ai-analyzer-sidebar'
    sidebar.style.cssText = `
      position: fixed;
      right: 0;
      top: 0;
      width: 350px;
      height: 100vh;
      background: white;
      box-shadow: -2px 0 8px rgba(0,0,0,0.15);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #ddd;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `

    // 创建侧边栏头部（关闭按钮）
    const header = document.createElement('div')
    header.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      flex-shrink: 0;
    `
    header.innerHTML = `
      <span style="font-weight: 600; color: #333; font-size: 14px;">AI财报分析</span>
      <button id="close-sidebar" style="
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      ">&times;</button>
    `

    // 创建iframe容器（不使用sandbox，让iframe完全访问）
    const iframeWrapper = document.createElement('div')
    iframeWrapper.style.cssText = `
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `

    // 创建iframe加载Web应用
    const iframe = document.createElement('iframe')
    iframe.src = 'http://localhost:10011/#/taskpane'
    iframe.style.cssText = `
      flex: 1;
      border: none;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    `
    iframe.allow = 'geolocation; microphone; camera; payment'

    // 组装侧边栏
    iframeWrapper.appendChild(iframe)
    sidebar.appendChild(header)
    sidebar.appendChild(iframeWrapper)
    document.body.appendChild(sidebar)

    // 调整PDF查看器的右边距，为侧边栏让出空间
    // 延迟执行，让DOM完全渲染
    setTimeout(() => {
      // 查找PDF查看器容器并调整
      const pdfViewers = [
        document.querySelector('#viewer'),
        document.querySelector('[role="document"]'),
        document.querySelector('.pdfViewer'),
        document.querySelector('embed'),
        document.querySelector('object')
      ]

      for (const viewer of pdfViewers) {
        if (viewer) {
          console.log('[AI财报] 找到PDF查看器，调整布局')
          viewer.style.marginRight = '350px'
          viewer.style.width = `calc(100% - 350px)`
          break
        }
      }

      // 如果找不到，调整整个body
      const existingContent = document.body.querySelector(':not(#ai-analyzer-sidebar)')
      if (existingContent) {
        existingContent.style.marginRight = '350px'
        existingContent.style.maxWidth = `calc(100% - 350px)`
      }
    }, 100)

    // 关闭按钮事件
    document.getElementById('close-sidebar').addEventListener('click', () => {
      sidebar.remove()
      // 恢复布局
      document.body.style.overflow = 'auto'
      const viewers = document.querySelectorAll(
        '#viewer, [role="document"], .pdfViewer, embed, object'
      )
      viewers.forEach((v) => {
        v.style.marginRight = '0'
        v.style.width = 'auto'
      })
      console.log('[AI财报] 侧边栏已关闭')
    })

    console.log('[AI财报] 侧边栏创建完成')
  }
})()
