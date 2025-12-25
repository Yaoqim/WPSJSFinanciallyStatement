// 弹窗逻辑
document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status')
  const openAnalyzerBtn = document.getElementById('openAnalyzerBtn')
  const closeBtn = document.getElementById('closeBtn')

  // 检查当前标签页是否是PDF
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0]
    const isPDF =
      currentTab.url &&
      (currentTab.url.includes('.pdf') || currentTab.url.includes('application/pdf'))

    if (isPDF) {
      statusEl.textContent = '✅ 检测到PDF文件'
      statusEl.classList.remove('notpdf')
      statusEl.classList.add('ready')
      openAnalyzerBtn.disabled = false
    } else {
      statusEl.textContent = '⚠️ 当前不是PDF文件'
      statusEl.classList.add('notpdf')
      openAnalyzerBtn.disabled = true
    }
  })

  // 打开分析应用
  openAnalyzerBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'http://localhost:10011/#/taskpane',
      active: true
    })
    window.close()
  })

  // 关闭弹窗
  closeBtn.addEventListener('click', () => {
    window.close()
  })
})
