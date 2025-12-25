# AI财报分析 - 浏览器插件版本

## 项目结构

```
extension/
├── manifest.json          # 插件配置文件（Manifest V3）
├── background.js          # 后台脚本（创建右键菜单）
├── content-script.js      # 内容脚本（检测PDF）
├── popup.html            # 弹窗界面
├── popup.js              # 弹窗逻辑
├── icons/                # 插件图标
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md             # 本文件
```

## 核心功能

### 1. 右键菜单集成

- 在任何页面的右键菜单中添加"AI财报分析"选项
- 点击后自动打开分析Web应用

### 2. PDF检测

- 自动检测当前页面是否是PDF
- 在插件弹窗中显示PDF状态

### 3. Web应用集成

- 点击右键菜单或弹窗按钮后，打开Web应用
- Web应用地址：http://localhost:5173/#/taskpane

## 用户交互流程

```
1. 用户在浏览器中打开本地PDF文件
   ↓
2. 用户右键点击PDF
   ↓
3. 在右键菜单中选择"AI财报分析"
   ↓
4. 插件打开新标签页，加载Web应用
   ↓
5. 用户在Web应用中进行分析操作
   ↓
6. 后端API处理分析请求
   ↓
7. 显示结果、导出数据等
```

## 开发和部署

### Chrome浏览器安装步骤

1. **打开扩展程序页面**
   - 输入 `chrome://extensions/` 访问

2. **启用开发者模式**
   - 右上角打开"开发者模式"

3. **加载扩展程序**
   - 点击"加载已解压的扩展程序"
   - 选择 `extension/` 文件夹
   - 确认加载

4. **启动Web应用**

   ```bash
   cd ../../../  # 返回到项目根目录
   npm run dev
   ```

5. **测试**
   - 在浏览器中打开本地PDF文件
   - 右键点击 → 选择"AI财报分析"
   - 或点击浏览器地址栏右侧的扩展程序图标

### Firefox浏览器安装步骤

1. **打开附加组件页面**
   - 输入 `about:debugging#/runtime/this-firefox` 访问

2. **加载临时附加组件**
   - 点击"加载临时附加组件"
   - 选择 `extension/manifest.json` 文件

3. **启动Web应用**
   - 同上

## 技术细节

### manifest.json 配置说明

- `manifest_version: 3` - 使用最新的Manifest V3规范
- `permissions` - 所需权限
- `contextMenus` - 右键菜单权限
- `activeTab` - 获取当前标签页信息
- `host_permissions` - 访问file://本地文件权限

### 关键API

- `chrome.contextMenus` - 创建和管理右键菜单
- `chrome.tabs` - 管理浏览器标签页
- `chrome.runtime` - 消息传递和事件监听
- `chrome.action` - 扩展程序按钮交互

## 后续改进

1. **PDF上传功能**
   - Web应用支持直接上传PDF文件
   - 后端处理上传的PDF

2. **分析历史记录**
   - 记录用户的分析历史
   - 支持重复查看历史分析

3. **导出功能完善**
   - Excel导出
   - PDF报告导出
   - Word文档导出

4. **用户认证**
   - 添加用户登录功能
   - 保存个人分析数据

5. **性能优化**
   - 代码分割和懒加载
   - 缓存优化
   - API调用优化

## 注意事项

- 确保Web应用运行在 `http://localhost:5173` 上
- 端口10011（后端API）必须保持不变
- 浏览器必须允许本地文件访问（file://）
- 不同浏览器的扩展程序兼容性有差异

## 调试技巧

1. **查看日志**
   - 打开 `chrome://extensions/`
   - 在插件下方点击"背景页"查看后台日志
   - 在页面控制台查看内容脚本日志

2. **重新加载插件**
   - 修改任何代码后，点击插件的刷新按钮
   - 或重新加载扩展程序

3. **测试PDF**
   - 下载一个PDF文件
   - 在浏览器中直接打开（Ctrl+O）
   - 或拖拽到浏览器窗口

## 常见问题

**Q: 插件无法在本地PDF上工作？**
A: 确保在插件权限中授予file://访问权限，并且manifest.json中的host_permissions包含"file:///\*"

**Q: 右键菜单没有出现？**
A: 检查background.js中的chrome.contextMenus.create是否正确执行，查看扩展程序的背景页日志

**Q: Web应用无法打开？**
A: 确保npm run dev已启动，且应用运行在localhost:5173

## 许可证

MIT License
