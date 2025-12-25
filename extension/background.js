console.log('[Service Worker] 背景脚本已加载')

// **关键函数：在service worker中用XMLHttpRequest读取PDF文件**
// service worker有完整的扩展权限，可以访问file://文件，不受CORS限制
function readPdfFileAsBase64(pdfUrl) {
  return new Promise((resolve, reject) => {
    console.log('[Service Worker] 开始读取PDF文件:', pdfUrl)

    const xhr = new XMLHttpRequest()
    xhr.open('GET', pdfUrl, true)
    xhr.responseType = 'arraybuffer'
    xhr.timeout = 30000

    xhr.onload = function () {
      if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
        try {
          const arrayBuffer = xhr.response
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error('获取到的PDF内容为空')
          }

          // 转换为base64
          const bytes = new Uint8Array(arrayBuffer)
          let binary = ''
          for (let i = 0; i < bytes.length; i += 65536) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 65536))
          }
          const base64 = btoa(binary)

          console.log(
            '[Service Worker] 成功读取PDF文件，大小:',
            arrayBuffer.byteLength,
            'base64长度:',
            base64.length
          )
          resolve(base64)
        } catch (error) {
          console.error('[Service Worker] 处理PDF失败:', error.message)
          reject(error)
        }
      } else {
        console.error('[Service Worker] XHR请求失败，状态:', xhr.status, xhr.statusText)
        reject(new Error(`XHR请求失败: ${xhr.status} ${xhr.statusText}`))
      }
    }

    xhr.onerror = function () {
      console.error('[Service Worker] XHR请求错误')
      reject(new Error('XHR请求错误'))
    }

    xhr.ontimeout = function () {
      console.error('[Service Worker] XHR请求超时')
      reject(new Error('XHR请求超时'))
    }

    try {
      xhr.send()
    } catch (error) {
      console.error('[Service Worker] XHR send异常:', error.message)
      reject(error)
    }
  })
}

// 右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('[Service Worker] 右键菜单点击')

  if (info.menuItemId === 'ai-financial-analyze') {
    // 直接查询当前活跃标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.log('[Service Worker] 没有找到活跃标签页')
        return
      }

      const activeTab = tabs[0]
      console.log('[Service Worker] 活跃标签页URL:', activeTab.url)

      // 检查是否是PDF
      const url = activeTab.url.toLowerCase()
      const isPdf = url.endsWith('.pdf') || url.includes('application/pdf')

      console.log('[Service Worker] isPdf:', isPdf)

      if (isPdf) {
        console.log('[Service Worker] 检测到PDF文件，开始读取...')

        // **关键：先在service worker中读取PDF文件为base64**
        readPdfFileAsBase64(activeTab.url)
          .then((base64) => {
            console.log('[Service Worker] 成功读取了PDF，开始发送消息到content-script')
            // 成功后，发送消恫给content-script，并传递base64数据
            chrome.tabs.sendMessage(
              activeTab.id,
              {
                action: 'showAnalyzer',
                pdfUrl: activeTab.url,
                pdfBase64: base64 // **将base64数据一起发送给iframe**
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.log('[Service Worker] 发送消息失败:', chrome.runtime.lastError.message)
                } else {
                  console.log('[Service Worker] 消息已发送')
                }
              }
            )
          })
          .catch((error) => {
            console.error('[Service Worker] 读取PDF失败:', error.message)
            // 即使读取失败，也要显示侧边栏，让iframe自己尝试
            chrome.tabs.sendMessage(
              activeTab.id,
              {
                action: 'showAnalyzer',
                pdfUrl: activeTab.url,
                pdfError: error.message
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.log(
                    '[Service Worker] 发送错误消息失败:',
                    chrome.runtime.lastError.message
                  )
                } else {
                  console.log('[Service Worker] 错误消息已发送')
                }
              }
            )
          })
      } else {
        console.log('[Service Worker] 不是PDF文件')
      }
    })
  }
})

// 插件安装时创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Service Worker] 插件已安装，创建右键菜单')

  chrome.contextMenus.removeAll(() => {
    console.log('[Service Worker] 旧菜单已清除')

    // 创建菜单
    chrome.contextMenus.create({
      id: 'ai-financial-analyze',
      title: 'AI财报分析',
      contexts: ['page', 'frame', 'selection', 'link', 'image']
    })
    console.log('[Service Worker] 右键菜单已创建')
  })
})
