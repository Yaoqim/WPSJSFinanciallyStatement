# WPS AI Contract 后端API接口文档

基于OpenAPI 3.1.0规范，该文档列出所有可用的API接口、请求参数、响应参数以及认证要求。

---

## 认证说明

### OAuth2PasswordBearer (Bearer Token 认证)

使用OAuth2 密码授权流程进行身份验证。获得token后，在所有需要认证的API请求中，使用以下方式进行认证：

**请求头**:

```
Authorization: Bearer {access_token}
```

**示例**:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://api.example.com/api/auth/me
```

**获取Token步骤**:

1. 调用 `/api/auth/token` 接口（POST）
2. 发送用户名和密码
3. 获得响应中的 `access_token`
4. 在后续请求的 `Authorization` 请求头中使用此token

**Token 有效期**:

- 根据服务器配置，token通常有一定的有效期
- Token过期后需要重新登录获取新的token

---

## 目录

1. [系统管理接口](#系统管理接口)
2. [认证接口](#认证接口)
3. [聊天接口](#聊天接口)
4. [仪表板接口](#仪表板接口)
5. [知识库接口](#知识库接口)
6. [评估接口](#评估接口)
7. [思维导图接口](#思维导图接口)
8. [知识图谱接口](#知识图谱接口)
9. [任务接口](#任务接口)

---

## 系统管理接口

### 1. 系统健康检查

- **路径**: `/api/system/health`
- **方法**: `GET`
- **认证**: 否（公开接口）
- **描述**: 系统健康检查接口
- **响应**: `200` - 成功响应 (JSON)

### 2. 获取系统配置

- **路径**: `/api/system/config`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取系统配置
- **响应**: `200` - 成功响应 (JSON)

### 3. 更新单个配置项

- **路径**: `/api/system/config`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 更新单个配置项
- **请求体**:
  ```json
  {
    "key": "string",
    "value": "any"
  }
  ```
- **响应**: `200` - 成功响应 (JSON对象)

### 4. 批量更新配置项

- **路径**: `/api/system/config/update`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 批量更新配置项
- **请求体**: 任意键值对对象
- **响应**: `200` - 成功响应 (JSON对象)

### 5. 获取系统日志

- **路径**: `/api/system/logs`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取系统日志
- **响应**: `200` - 成功响应

### 6. 获取系统信息配置

- **路径**: `/api/system/info`
- **方法**: `GET`
- **认证**: 否（公开接口）
- **描述**: 获取系统信息配置（无需认证）
- **响应**: `200` - 成功响应

### 7. 重新加载信息配置

- **路径**: `/api/system/info/reload`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 重新加载信息配置
- **响应**: `200` - 成功响应

### 8. 获取OCR统计信息

- **路径**: `/api/system/ocr/stats`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取OCR服务使用统计信息
- **响应**: `200` - 统计数据

### 9. 检查OCR服务健康状态

- **路径**: `/api/system/ocr/health`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 检查所有OCR服务的健康状态
- **响应**: `200` - 各OCR服务可用性

### 10. 获取聊天模型状态

- **路径**: `/api/system/chat-models/status`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取指定聊天模型的状态
- **查询参数**:
  - `provider` (required): 供应商名称
  - `model_name` (required): 模型名称
- **响应**: `200` - 模型状态

### 11. 获取所有聊天模型状态

- **路径**: `/api/system/chat-models/all/status`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取所有聊天模型的状态
- **响应**: `200` - 所有模型状态

### 12. 获取自定义供应商

- **路径**: `/api/system/custom-providers`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取所有自定义供应商
- **响应**: `200` - 供应商列表

### 13. 添加自定义供应商

- **路径**: `/api/system/custom-providers`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 添加自定义供应商
- **请求体**:
  ```json
  {
    "provider_id": "string",
    "provider_data": {}
  }
  ```
- **响应**: `200` - 成功响应

### 14. 更新自定义供应商

- **路径**: `/api/system/custom-providers/{provider_id}`
- **方法**: `PUT`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `provider_id` (路径参数)
- **请求体**: 供应商配置数据 (JSON对象)
- **响应**: `200` - 成功响应

### 15. 删除自定义供应商

- **路径**: `/api/system/custom-providers/{provider_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `provider_id` (路径参数)
- **响应**: `200` - 成功响应

### 16. 测试自定义供应商连接

- **路径**: `/api/system/custom-providers/{provider_id}/test`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `provider_id` (路径参数)
- **请求体**: 测试请求 (JSON对象)
- **响应**: `200` - 测试结果

---

## 认证接口

### 1. 登录获取Token

- **路径**: `/api/auth/token`
- **方法**: `POST`
- **认证**: 否
- **描述**: 登录获取访问令牌
- **请求头**: `Content-Type: application/x-www-form-urlencoded`
- **请求体**:
  ```
  username=string&password=string&grant_type=password&scope=&client_id=&client_secret=
  ```
- **响应** (`200`):
  ```json
  {
    "access_token": "string",
    "token_type": "string",
    "user_id": 0,
    "username": "string",
    "user_id_login": "string",
    "phone_number": "string",
    "avatar": "string",
    "role": "string"
  }
  ```

### 2. 检查首次运行

- **路径**: `/api/auth/check-first-run`
- **方法**: `GET`
- **认证**: 否
- **描述**: 检查系统是否首次运行
- **响应**: `200` - 首次运行状态

### 3. 初始化管理员

- **路径**: `/api/auth/initialize`
- **方法**: `POST`
- **认证**: 否
- **描述**: 初始化管理员账户
- **请求体**:
  ```json
  {
    "user_id": "string",
    "password": "string",
    "phone_number": "string"
  }
  ```
- **响应** (`200`): Token对象（同登录接口）

### 4. 获取当前用户信息

- **路径**: `/api/auth/me`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取当前登录用户的信息
- **响应** (`200`) - UserResponse对象:

  ```json
  {
    "id": 1,
    "username": "admin",
    "user_id": "admin_001",
    "phone_number": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "role": "admin",
    "created_at": "2024-12-20T10:30:00Z",
    "last_login": "2024-12-20T15:45:30Z"
  }
  ```

  **字段说明**:
  - `id` (integer): 用户系统ID（自增）
  - `username` (string): 登录用户名
  - `user_id` (string): 业务用户ID
  - `phone_number` (string|null): 用户手机号
  - `avatar` (string|null): 用户头像URL
  - `role` (string): 用户角色 (admin/user)
  - `created_at` (string): 创建时间（ISO 8601格式）
  - `last_login` (string|null): 最后登录时间

### 5. 更新用户个人资料

- **路径**: `/api/auth/profile`
- **方法**: `PUT`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 更新当前用户的个人资料
- **请求体** - UserProfileUpdate对象:

  ```json
  {
    "username": "new_username",
    "phone_number": "13877777777"
  }
  ```

  **字段说明**:
  - `username` (string|null): 新用户名（可选）
  - `phone_number` (string|null): 新手机号（可选）

- **响应** (`200`) - UserResponse对象:
  ```json
  {
    "id": 1,
    "username": "new_username",
    "user_id": "admin_001",
    "phone_number": "13877777777",
    "avatar": "https://example.com/avatar.jpg",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-12-20T15:45:30Z"
  }
  ```

### 6. 创建用户

- **路径**: `/api/auth/users`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 创建新用户
- **请求体** - UserCreate对象:

  ```json
  {
    "username": "john_doe",
    "password": "SecurePass123",
    "role": "user",
    "phone_number": "13900139000"
  }
  ```

  **字段说明**:
  - `username` (string): 用户名（必需）
  - `password` (string): 密码（必需）
  - `role` (string): 用户角色，默认"user"（可选）
  - `phone_number` (string|null): 手机号（可选）

- **响应** (`200`) - UserResponse对象:
  ```json
  {
    "id": 2,
    "username": "john_doe",
    "user_id": "john_doe_002",
    "phone_number": "13900139000",
    "avatar": null,
    "role": "user",
    "created_at": "2024-12-20T16:00:00Z",
    "last_login": null
  }
  ```

### 7. 获取用户列表

- **路径**: `/api/auth/users`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取用户列表（支持分页）
- **查询参数**:
  - `skip` (integer, 可选): 跳过的用户数，默认0
  - `limit` (integer, 可选): 每页用户数，默认100

- **响应** (`200`) - UserResponse对象数组:
  ```json
  [
    {
      "id": 1,
      "username": "admin",
      "user_id": "admin_001",
      "phone_number": "13800138000",
      "avatar": "https://example.com/avatar1.jpg",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-12-20T15:45:30Z"
    },
    {
      "id": 2,
      "username": "john_doe",
      "user_id": "john_doe_002",
      "phone_number": "13900139000",
      "avatar": null,
      "role": "user",
      "created_at": "2024-12-20T16:00:00Z",
      "last_login": "2024-12-20T14:20:00Z"
    }
  ]
  ```

### 8. 获取单个用户

- **路径**: `/api/auth/users/{user_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `user_id` (路径参数，整数，用户系统ID)

- **响应** (`200`) - UserResponse对象:
  ```json
  {
    "id": 1,
    "username": "admin",
    "user_id": "admin_001",
    "phone_number": "13800138000",
    "avatar": "https://example.com/avatar1.jpg",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-12-20T15:45:30Z"
  }
  ```

### 9. 更新用户

- **路径**: `/api/auth/users/{user_id}`
- **方法**: `PUT`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `user_id` (路径参数，整数，用户系统ID)
- **请求体** - UserUpdate对象:

  ```json
  {
    "username": "john_updated",
    "password": "NewPassword123",
    "role": "admin",
    "phone_number": "13988888888",
    "avatar": "https://example.com/avatar_new.jpg"
  }
  ```

  **字段说明**（全部可选）:
  - `username` (string|null): 新用户名
  - `password` (string|null): 新密码
  - `role` (string|null): 新角色
  - `phone_number` (string|null): 新手机号
  - `avatar` (string|null): 新头像URL

- **响应** (`200`) - UserResponse对象:
  ```json
  {
    "id": 2,
    "username": "john_updated",
    "user_id": "john_doe_002",
    "phone_number": "13988888888",
    "avatar": "https://example.com/avatar_new.jpg",
    "role": "admin",
    "created_at": "2024-12-20T16:00:00Z",
    "last_login": "2024-12-20T14:20:00Z"
  }
  ```

### 10. 删除用户

- **路径**: `/api/auth/users/{user_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `user_id` (路径参数，整数，用户系统ID)
- **响应** (`200`) - 成功响应:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

### 11. 验证用户名

- **路径**: `/api/auth/validate-username`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 验证用户名格式并生成可用的user_id
- **请求体** - UsernameValidation对象:

  ```json
  {
    "username": "john_doe"
  }
  ```

  **字段说明**:
  - `username` (string): 用户名，必需

- **响应** (`200`) - 验证结果:

  ```json
  {
    "username": "john_doe",
    "user_id": "john_doe_001",
    "is_available": true
  }
  ```

  **字段说明**:
  - `username` (string): 验证的用户名
  - `user_id` (string): 自动生成的业务用户ID
  - `is_available` (boolean): 用户名是否可用

### 12. 检查User ID可用性

- **路径**: `/api/auth/check-user-id/{user_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `user_id` (路径参数，字符串，业务用户ID)
- **响应** (`200`) - 可用性检查结果:

  ```json
  {
    "user_id": "john_doe_001",
    "is_available": true
  }
  ```

  **字段说明**:
  - `user_id` (string): 要检查的业务用户ID
  - `is_available` (boolean): 是否可用

### 13. 上传用户头像

- **路径**: `/api/auth/upload-avatar`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 上传用户头像并更新用户信息
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**: 文件上传
  - `file` (binary, required): 头像图片文件

- **响应** (`200`) - 上传结果:

  ```json
  {
    "id": 1,
    "username": "admin",
    "user_id": "admin_001",
    "phone_number": "13800138000",
    "avatar": "https://example.com/avatars/avatar_001.jpg",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-12-20T15:45:30Z"
  }
  ```

  返回更新后的UserResponse对象

---

## 聊天接口

### 1. 获取默认智能体

- **路径**: `/api/chat/default_agent`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取默认智能体ID
- **响应** (`200`) - 默认智能体ID:

  ```json
  {
    "agent_id": "default_agent"
  }
  ```

  **字段说明**:
  - `agent_id` (string): 默认智能体的ID

### 2. 设置默认智能体

- **路径**: `/api/chat/set_default_agent`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 设置默认智能体ID (仅管理员)
- **请求体**:

  ```json
  {
    "agent_id": "string"
  }
  ```

  **字段说明**:
  - `agent_id` (string): 要设置为默认的智能体ID

- **响应** (`200`) - 设置结果:
  ```json
  {
    "agent_id": "new_default_agent",
    "message": "Default agent set successfully"
  }
  ```

### 3. 简单问答

- **路径**: `/api/chat/call`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 调用模型进行简单问答
- **请求体**:

  ```json
  {
    "query": "What is the capital of France?",
    "meta": {}
  }
  ```

  **字段说明**:
  - `query` (string): 用户提供的问题或提示
  - `meta` (object, optional): 元数据，可以包含上下文信息

- **响应** (`200`) - 回复内容:

  ```json
  {
    "response": "Paris is the capital of France.",
    "message_id": 1
  }
  ```

  **字段说明**:
  - `response` (string): 模型的回复文本
  - `message_id` (integer): 消息段的ID，用于反馈

### 4. 获取所有可用智能体

- **路径**: `/api/chat/agent`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 获取所有可用智能体的基本信息
- **响应** (`200`) - 智能体列表:
  ```json
  [
    {
      "id": "agent_001",
      "name": "General QA Agent",
      "description": "General question answering agent"
    },
    {
      "id": "agent_002",
      "name": "Code Analysis Agent",
      "description": "Code analysis and debugging agent"
    }
  ]
  ```

### 5. 获取指定智能体详细信息

- **路径**: `/api/chat/agent/{agent_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **描述**: 获取指定智能体的完整信息（包含配置选项）
- **响应** (`200`) - 智能体详情:
  ```json
  {
    "id": "agent_001",
    "name": "General QA Agent",
    "description": "General question answering agent",
    "config": {
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 2000
    },
    "tools": ["web_search", "calculator"]
  }
  ```

### 6. 使用智能体对话

- **路径**: `/api/chat/agent/{agent_id}`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **描述**: 使用特定智能体进行对话
- **请求体**:

  ```json
  {
    "query": "Analyze this code snippet",
    "config": {
      "thread_id": "thread_123",
    },
    "meta": {
      "context": "code review"
    },
    "image_content": "base64_encoded_image_string"
  }
  ```

  **字段说明**:
  - `query` (string): 用户提供的问题或提示
  - `config` (object, optional): 智能体配置，会覆盖默认配置
  - `meta` (object, optional): 元数据
  - `image_content` (string, optional): base64编码的图像数据

- **响应** (`200`) - 对话结果:
  ```json
  {
    "response": "This code has good structure...",
    "message_id": 2,
    "thread_id": "thread_123"
  }
  ```

### 7. 获取聊天模型列表

- **路径**: `/api/chat/models`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `model_provider` (required, string): 模型提供商（概OpenAI、Anthropic等）

- **响应** (`200`) - 模型列表:
  ```json
  [
    {
      "model_name": "gpt-4",
      "provider": "OpenAI",
      "available": true
    },
    {
      "model_name": "gpt-3.5-turbo",
      "provider": "OpenAI",
      "available": true
    }
  ]
  ```

### 8. 更新聊天模型列表

- **路径**: `/api/chat/models/update`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 更新指定模型提供商的模型列表 (仅管理员)
- **查询参数**:
  - `model_provider` (required, string): 模型提供商

- **请求体** - 字符串数组:

  ```json
  ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"]
  ```

  **请求体描述**: 模型名称数组

- **响应** (`200`) - 更新结果:
  ```json
  {
    "updated_count": 3,
    "message": "Models updated successfully"
  }
  ```

### 9. 获取可用工具

- **路径**: `/api/chat/tools`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `agent_id` (required, string): 智能体ID

- **响应** (`200`) - 工具列表:
  ```json
  [
    {
      "name": "web_search",
      "description": "Search the web for information",
      "enabled": true
    },
    {
      "name": "calculator",
      "description": "Perform mathematical calculations",
      "enabled": true
    }
  ]
  ```

### 10. 恢復被中断的对话

- **路径**: `/api/chat/agent/{agent_id}/resume`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **描述**: 恢復被人工审批中断的对话
- **请求体**:

  ```json
  {
    "thread_id": "thread_123",
    "approved": true
  }
  ```

  **字段说明**:
  - `thread_id` (string): 对话线ID
  - `approved` (boolean): 是否批准

- **响应** (`200`) - 恢復结果:
  ```json
  {
    "message": "Conversation resumed",
    "response": "Continuing with the previous context..."
  }
  ```

### 11. 保存智能体配置

- **路径**: `/api/chat/agent/{agent_id}/config`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **描述**: 保存智能体配置YAML文件
- **请求体** - 配置对象:

  ```json
  {
    "model": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 2000,
    "system_prompt": "You are a helpful assistant.",
    "tools": ["web_search", "calculator"]
  }
  ```

- **响应** (`200`) - 保存结果:
  ```json
  {
    "message": "Config saved successfully",
    "agent_id": "agent_001"
  }
  ```

### 12. 获取智能体配置

- **路径**: `/api/chat/agent/{agent_id}/config`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **描述**: 从 YAML 文件加载智能体配置
- **响应** (`200`) - 配置内容:
  ```json
  {
    "agent_id": "agent_001",
    "name": "General QA Agent",
    "config": {
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 2000,
      "system_prompt": "You are a helpful assistant.",
      "tools": ["web_search", "calculator"]
    }
  }
  ```

### 13. 获取智能体历史消息

- **路径**: `/api/chat/agent/{agent_id}/history`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **查询参数**:
  - `thread_id` (required, string): 线程ID

- **描述**: 获取智能体历史消息 (使用新存储系统)
- **响应** (`200`) - 历史消息:
  ```json
  {
    "thread_id": "thread_123",
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "Hello",
        "timestamp": "2024-12-20T10:00:00Z"
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "Hi, how can I help?",
        "timestamp": "2024-12-20T10:00:05Z"
      }
    ]
  }
  ```

### 14. 获取智能体状态

- **路径**: `/api/chat/agent/{agent_id}/state`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `agent_id` (路径参数，字符串)
- **查询参数**:
  - `thread_id` (required, string): 线程ID

- **响应** (`200`) - 智能体状态:
  ```json
  {
    "thread_id": "thread_123",
    "agent_id": "agent_001",
    "status": "idle",
    "last_message_id": "msg_002",
    "updated_at": "2024-12-20T10:00:05Z"
  }
  ```

### 15. 创建对话线程

- **路径**: `/api/chat/thread`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 创建新对话线程 (使用新存储系统)
- **请求体**:

  ```json
  {
    "title": "Conversation about Python",
    "agent_id": "agent_001",
    "metadata": {
      "category": "programming",
      "tags": ["python", "development"]
    }
  }
  ```

  **字段说明**:
  - `title` (string): 线程标题
  - `agent_id` (string): 智能体ID
  - `metadata` (object, optional): 元数据信息

- **响应** (`200`) - 线程对象:
  ```json
  {
    "id": "thread_123",
    "user_id": "user_001",
    "agent_id": "agent_001",
    "title": "Conversation about Python",
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T10:00:00Z"
  }
  ```

### 16. 获取用户的所有对话线程

- **路径**: `/api/chat/threads`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `agent_id` (required, string): 智能体ID

- **响应** (`200`) - 线程数组:
  ```json
  [
    {
      "id": "thread_123",
      "user_id": "user_001",
      "agent_id": "agent_001",
      "title": "First Conversation",
      "created_at": "2024-12-20T10:00:00Z",
      "updated_at": "2024-12-20T15:30:00Z"
    },
    {
      "id": "thread_124",
      "user_id": "user_001",
      "agent_id": "agent_001",
      "title": "Second Conversation",
      "created_at": "2024-12-21T08:00:00Z",
      "updated_at": "2024-12-21T09:15:00Z"
    }
  ]
  ```

### 17. 删除对话线程

- **路径**: `/api/chat/thread/{thread_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `thread_id` (路径参数，字符串)
- **响应** (`200`) - 删除结果:
  ```json
  {
    "message": "Thread deleted successfully"
  }
  ```

### 18. 更新对话线程

- **路径**: `/api/chat/thread/{thread_id}`
- **方法**: `PUT`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `thread_id` (路径参数，字符串)
- **请求体**:

  ```json
  {
    "title": "Updated Conversation Title"
  }
  ```

  **字段说明**:
  - `title` (string): 新的线程标题

- **响应** (`200`) - ThreadResponse对象:
  ```json
  {
    "id": "thread_123",
    "user_id": "user_001",
    "agent_id": "agent_001",
    "title": "Updated Conversation Title",
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T16:00:00Z"
  }
  ```

### 19. 上传线程附件

- **路径**: `/api/chat/thread/{thread_id}/attachments`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `thread_id` (路径参数，字符串)
- **描述**: 上传并解析附件为Markdown
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**: 文件上传
  - `file` (binary, required): 附件文件

- **响应** (`200`) - AttachmentResponse对象:
  ```json
  {
    "id": "file_001",
    "thread_id": "thread_123",
    "filename": "document.pdf",
    "file_type": "application/pdf",
    "size_bytes": 102400,
    "markdown_content": "# Document Content\n...",
    "uploaded_at": "2024-12-20T10:00:00Z"
  }
  ```

### 20. 获取线程附件列表

- **路径**: `/api/chat/thread/{thread_id}/attachments`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `thread_id` (路径参数，字符串)
- **响应** (`200`) - AttachmentListResponse对象:
  ```json
  {
    "thread_id": "thread_123",
    "attachments": [
      {
        "id": "file_001",
        "filename": "document.pdf",
        "file_type": "application/pdf",
        "size_bytes": 102400,
        "uploaded_at": "2024-12-20T10:00:00Z"
      },
      {
        "id": "file_002",
        "filename": "data.xlsx",
        "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size_bytes": 51200,
        "uploaded_at": "2024-12-20T10:05:00Z"
      }
    ]
  }
  ```

### 21. 删除线程附件

- **路径**: `/api/chat/thread/{thread_id}/attachments/{file_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `thread_id` (路径参数，字符串)
  - `file_id` (路径参数，字符串)

- **响应** (`200`) - 删除结果:
  ```json
  {
    "message": "Attachment deleted successfully"
  }
  ```

### 22. 提交消息反馈

- **路径**: `/api/chat/message/{message_id}/feedback`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `message_id` (路径参数，整数)
- **描述**: 提交用户对特定消息的反馈
- **请求体**:

  ```json
  {
    "rating": "like",
    "reason": "Very helpful and accurate response"
  }
  ```

  **字段说明**:
  - `rating` (string): 反馈等级，整数根据具体实现（常见like/dislike）
  - `reason` (string|null): 反馈原因（可选）

- **响应** (`200`) - FeedbackResponse对象:
  ```json
  {
    "id": 1,
    "message_id": 5,
    "rating": "like",
    "reason": "Very helpful and accurate response",
    "created_at": "2024-12-20T10:30:00Z"
  }
  ```

### 23. 获取消息反馈状态

- **路径**: `/api/chat/message/{message_id}/feedback`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `message_id` (路径参数，整数)
- **描述**: 获取反馈状态（当前用户）
- **响应** (`200`) - FeedbackResponse对象:
  ```json
  {
    "id": 1,
    "message_id": 5,
    "rating": "like",
    "reason": "Very helpful and accurate response",
    "created_at": "2024-12-20T10:30:00Z"
  }
  ```

### 24. 上传图片

- **路径**: `/api/chat/image/upload`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 上传并处理图片，返回base64编码
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**: 文件上传
- **响应** (`200`):
  ```json
  {
    "success": true,
    "image_content": "string",
    "thumbnail_content": "string",
    "width": 0,
    "height": 0,
    "format": "string",
    "mime_type": "string",
    "size_bytes": 0,
    "error": "string"
  }
  ```

---

## 仪表板接口

### 1. 获取所有对话

- **路径**: `/api/dashboard/conversations`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **描述**: 获取所有对话（仅管理员）
- **查询参数**:
  - `user_id` (optional, string): 用户ID
  - `agent_id` (optional, string): 智能体ID
  - `status` (optional, string): 状态，默认"active"
  - `limit` (optional, integer): 限制，默认100
  - `offset` (optional, integer): 偏移，默认0

- **响应** (`200`) - 对话列表数组:
  ```json
  [
    {
      "thread_id": "thread_123",
      "user_id": "user_001",
      "agent_id": "agent_001",
      "title": "Conversation 1",
      "message_count": 5,
      "status": "active",
      "created_at": "2024-12-20T10:00:00Z",
      "updated_at": "2024-12-20T15:30:00Z"
    }
  ]
  ```

### 2. 获取对话详情

- **路径**: `/api/dashboard/conversations/{thread_id}`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **参数**: `thread_id` (路径参数，字符串)
- **响应** (`200`) - ConversationDetailResponse对象:
  ```json
  {
    "thread_id": "thread_123",
    "user_id": "user_001",
    "agent_id": "agent_001",
    "title": "Conversation 1",
    "message_count": 5,
    "status": "active",
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T15:30:00Z",
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "Hello",
        "timestamp": "2024-12-20T10:00:00Z"
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "Hi, how can I help?",
        "timestamp": "2024-12-20T10:00:05Z"
      }
    ]
  }
  ```

### 3. 获取用户活跃度统计

- **路径**: `/api/dashboard/stats/users`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **响应** (`200`):
  ```json
  {
    "total_users": 0,
    "active_users_24h": 0,
    "active_users_30d": 0,
    "daily_active_users": []
  }
  ```

### 4. 获取工具调用统计

- **路径**: `/api/dashboard/stats/tools`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **响应** (`200`):
  ```json
  {
    "total_calls": 0,
    "successful_calls": 0,
    "failed_calls": 0,
    "success_rate": 0,
    "most_used_tools": [],
    "tool_error_distribution": {},
    "daily_tool_calls": []
  }
  ```

### 5. 获取知识库统计

- **路径**: `/api/dashboard/stats/knowledge`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **响应** (`200`):
  ```json
  {
    "total_databases": 0,
    "total_files": 0,
    "total_nodes": 0,
    "total_storage_size": 0,
    "databases_by_type": {},
    "file_type_distribution": {}
  }
  ```

### 6. 获取智能体分析

- **路径**: `/api/dashboard/stats/agents`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **响应** (`200`):
  ```json
  {
    "total_agents": 0,
    "agent_conversation_counts": [],
    "agent_satisfaction_rates": [],
    "agent_tool_usage": [],
    "top_performing_agents": []
  }
  ```

### 7. 获取仓表板统计

- **路径**: `/api/dashboard/stats`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **响应** (`200`) - 综合统计数据:
  ```json
  {
    "total_users": 10,
    "total_conversations": 50,
    "total_agents": 3,
    "total_calls": 1000,
    "success_rate": 0.95,
    "average_response_time_ms": 250
  }
  ```

### 8. 获取所有反馈

- **路径**: `/api/dashboard/feedbacks`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **查询参数**:
  - `rating` (optional, string): 评分，常见like/dislike
  - `agent_id` (optional, string): 智能体ID

- **响应** (`200`) - 反馈列表:
  ```json
  [
    {
      "id": 1,
      "message_id": 5,
      "rating": "like",
      "reason": "Very helpful",
      "user_id": "user_001",
      "created_at": "2024-12-20T10:30:00Z"
    },
    {
      "id": 2,
      "message_id": 8,
      "rating": "dislike",
      "reason": "Not accurate",
      "user_id": "user_002",
      "created_at": "2024-12-20T11:00:00Z"
    }
  ]
  ```

### 9. 获取调用时间序列统计

- **路径**: `/api/dashboard/stats/calls/timeseries`
- **方法**: `GET`
- **认证**: 是 (仅管理员)
- **查询参数**:
  - `type` (optional, string): 类型，默认"models"（models/tools/agents）
  - `time_range` (optional, string): 时间范围，默认"14days"（1day/7days/14days/30days）

- **响应** (`200`) - TimeSeriesStats对象:
  ```json
  {
    "type": "models",
    "time_range": "14days",
    "data": [
      {
        "timestamp": "2024-12-20T00:00:00Z",
        "count": 150,
        "success_count": 142,
        "error_count": 8
      },
      {
        "timestamp": "2024-12-21T00:00:00Z",
        "count": 165,
        "success_count": 157,
        "error_count": 8
      }
    ]
  }
  ```

---

## 知识库接口

### 1. 获取所有知识库

- **路径**: `/api/knowledge/databases`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应** (`200`) - 知识库列表:
  ```json
  [
    {
      "db_id": "db_001",
      "database_name": "Project Docs",
      "description": "Project documentation",
      "kb_type": "lightrag",
      "embed_model_name": "bge-large",
      "created_at": "2024-12-20T10:00:00Z",
      "updated_at": "2024-12-20T15:30:00Z"
    }
  ]
  ```

### 2. 创建知识库

- **路径**: `/api/knowledge/databases`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **请求体**:

  ```json
  {
    "database_name": "Project Docs",
    "description": "Project documentation",
    "embed_model_name": "bge-large",
    "kb_type": "lightrag",
    "additional_params": {
      "chunk_size": 1024,
      "overlap": 200
    },
    "llm_info": {
      "provider": "openai",
      "model": "gpt-4",
      "api_key": "sk-..."
    }
  }
  ```

  **字段说明**:
  - `database_name` (string): 知识库名称，必需
  - `description` (string): 描述
  - `embed_model_name` (string): Embedding模型名称
  - `kb_type` (string): 知识库类型（lightrag/other）
  - `additional_params` (object, optional): 额外参数，如chunk_size、overlap等
  - `llm_info` (object, optional): LLM配置信息

- **响应** (`200`) - 创建结果:
  ```json
  {
    "db_id": "db_001",
    "database_name": "Project Docs",
    "description": "Project documentation",
    "kb_type": "lightrag",
    "embed_model_name": "bge-large",
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T10:00:00Z"
  }
  ```

### 3. 获取知识库详细信息

- **路径**: `/api/knowledge/databases/{db_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **响应** (`200`) - 知识库详情:
  ```json
  {
    "db_id": "db_001",
    "database_name": "Project Docs",
    "description": "Project documentation",
    "kb_type": "lightrag",
    "embed_model_name": "bge-large",
    "file_count": 15,
    "total_size_bytes": 5242880,
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T15:30:00Z"
  }
  ```

### 4. 更新知识库信息

- **路径**: `/api/knowledge/databases/{db_id}`
- **方法**: `PUT`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **请求体**:

  ```json
  {
    "database_name": "Updated Docs",
    "description": "Updated documentation",
    "llm_info": {
      "provider": "openai",
      "model": "gpt-4-turbo"
    },
    "additional_params": {
      "chunk_size": 1024,
      "overlap": 200
    }
  }
  ```

  **字段说明** (所有字段可选):
  - `database_name` (string): 知识库名称
  - `description` (string): 描述
  - `llm_info` (object): LLM配置
  - `additional_params` (object): 额外参数

- **响应** (`200`) - 更新结果:
  ```json
  {
    "db_id": "db_001",
    "database_name": "Updated Docs",
    "description": "Updated documentation",
    "kb_type": "lightrag",
    "embed_model_name": "bge-large",
    "updated_at": "2024-12-20T16:00:00Z"
  }
  ```

### 5. 删除知识库

- **路径**: `/api/knowledge/databases/{db_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **响应** (`200`) - 删除结果:
  ```json
  {
    "message": "Knowledge base deleted successfully"
  }
  ```

### 6. 导出知识库

- **路径**: `/api/knowledge/databases/{db_id}/export`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **查询参数**:
  - `format` (可选): 格式，可选值为"csv", "xlsx", "md", "txt"，默认"csv"
  - `include_vectors` (可选): 是否包含向量，默认false
- **响应**: `200` - 导出数据

### 7. 添加文档到知识库

- **路径**: `/api/knowledge/databases/{db_id}/documents`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求体**:
  ```json
  {
    "items": ["string"],
    "params": {}
  }
  ```
- **响应**: `200` - 添加结果

### 8. 获取文档详细信息

- **路径**: `/api/knowledge/databases/{db_id}/documents/{doc_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `doc_id` (路径参数)
- **响应**: `200` - 文档信息（包含基本信息和内容）

### 9. 删除文档

- **路径**: `/api/knowledge/databases/{db_id}/documents/{doc_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `doc_id` (路径参数)
- **响应**: `200` - 删除结果

### 10. 获取文档基本信息

- **路径**: `/api/knowledge/databases/{db_id}/documents/{doc_id}/basic`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `doc_id` (路径参数)
- **响应**: `200` - 文档元数据

### 11. 获取文档内容

- **路径**: `/api/knowledge/databases/{db_id}/documents/{doc_id}/content`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `doc_id` (路径参数)
- **响应**: `200` - 文档内容（chunks和lines）

### 12. 重新分块文档

- **路径**: `/api/knowledge/databases/{db_id}/documents/rechunks`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求体**:
  ```json
  {
    "file_ids": ["string"],
    "params": {}
  }
  ```
- **响应**: `200` - 重新分块结果

### 13. 下载文档

- **路径**: `/api/knowledge/databases/{db_id}/documents/{doc_id}/download`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `doc_id` (路径参数)
- **响应**: `200` - 下载文件

### 14. 查询知识库

- **路径**: `/api/knowledge/databases/{db_id}/query`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **请求体**:

  ```json
  {
    "query": "What is the project architecture?",
    "meta": {
      "top_k": 5,
      "score_threshold": 0.5,
      "use_rerank": false
    }
  }
  ```

  **字段说明**:
  - `query` (string): 查询文本，必需
  - `meta` (object, optional): 查询参数，包含top_k、score_threshold等

- **响应** (`200`) - 查询结果:
  ```json
  {
    "query": "What is the project architecture?",
    "results": [
      {
        "doc_id": "doc_001",
        "score": 0.92,
        "content": "The project architecture consists of..."
      }
    ],
    "total_hits": 1
  }
  ```

### 15. 测试查询

- **路径**: `/api/knowledge/databases/{db_id}/query-test`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **请求体**:

  ```json
  {
    "query": "Test query",
    "meta": {
      "top_k": 5,
      "score_threshold": 0.5
    }
  }
  ```

- **响应** (`200`) - 测试结果:
  ```json
  {
    "query": "Test query",
    "results": [
      {
        "doc_id": "doc_001",
        "score": 0.85,
        "content": "Test result content..."
      }
    ],
    "query_time_ms": 125
  }
  ```

### 16. 获取查询参数配置

- **路径**: `/api/knowledge/databases/{db_id}/query-params`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **响应** (`200`) - 查询参数:
  ```json
  {
    "top_k": 5,
    "score_threshold": 0.5,
    "use_rerank": false,
    "rerank_model": "bge-reranker-large",
    "chunk_overlap": 0.2
  }
  ```

### 17. 更新查询参数

- **路径**: `/api/knowledge/databases/{db_id}/query-params`
- **方法**: `PUT`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数，字符串)
- **请求体** - 参数对象:

  ```json
  {
    "top_k": 10,
    "score_threshold": 0.6,
    "use_rerank": true,
    "rerank_model": "bge-reranker-large",
    "chunk_overlap": 0.3
  }
  ```

- **响应** (`200`) - 更新结果:
  ```json
  {
    "message": "Query parameters updated successfully",
    "db_id": "db_001"
  }
  ```

### 18. 生成测试问题

- **路径**: `/api/knowledge/databases/{db_id}/sample-questions`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求体**: 包含count字段的对象
- **响应**: `200` - 生成的问题列表

### 19. 获取测试问题

- **路径**: `/api/knowledge/databases/{db_id}/sample-questions`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **响应**: `200` - 问题列表

### 20. 上传文件

- **路径**: `/api/knowledge/files/upload`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `db_id` (可选): 知识库ID
  - `allow_jsonl` (可选): 是否允许JSONL，默认false
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**: 文件上传
- **响应**: `200` - 上传结果

### 21. 获取支持的文件类型

- **路径**: `/api/knowledge/files/supported-types`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - 文件类型列表

### 22. 文件转Markdown

- **路径**: `/api/knowledge/files/markdown`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 调用process_file_to_markdown解析为markdown
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**: 文件上传
- **响应**: `200` - Markdown内容

### 23. 获取知识库类型

- **路径**: `/api/knowledge/types`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - 知识库类型列表

### 24. 获取知识库统计

- **路径**: `/api/knowledge/stats`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - 统计信息

### 25. 获取Embedding模型状态

- **路径**: `/api/knowledge/embedding-models/{model_id}/status`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `model_id` (路径参数)
- **响应**: `200` - 模型状态

### 26. 获取所有Embedding模型状态

- **路径**: `/api/knowledge/embedding-models/status`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - 所有模型状态

### 27. 生成描述

- **路径**: `/api/knowledge/generate-description`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **描述**: 使用LLM生成或优化知识库描述
- **请求体**:
  ```json
  {
    "name": "string",
    "current_description": "string"
  }
  ```
- **响应**: `200` - 生成的描述

---

## 评估接口

### 1. 获取评估基准详情

- **路径**: `/api/evaluation/databases/{db_id}/benchmarks/{benchmark_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `benchmark_id` (路径参数)
- **查询参数**:
  - `page` (可选): 页码，默认1
  - `page_size` (可选): 页大小，默认10
- **响应**: `200` - 基准详情

### 2. 删除评估基准

- **路径**: `/api/evaluation/benchmarks/{benchmark_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `benchmark_id` (路径参数)
- **响应**: `200` - 删除结果

### 3. 获取评估结果

- **路径**: `/api/evaluation/databases/{db_id}/results/{task_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `task_id` (路径参数)
- **查询参数**:
  - `page` (可选): 页码，默认1
  - `page_size` (可选): 页大小，默认20
  - `error_only` (可选): 仅显示错误，默认false
- **响应**: `200` - 评估结果

### 4. 删除评估结果

- **路径**: `/api/evaluation/databases/{db_id}/results/{task_id}`
- **方法**: `DELETE`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**:
  - `db_id` (路径参数)
  - `task_id` (路径参数)
- **响应**: `200` - 删除结果

### 5. 上传评估基准

- **路径**: `/api/evaluation/databases/{db_id}/benchmarks/upload`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**:
  ```
  file: binary
  name: string
  description: string (可选)
  ```
- **响应**: `200` - 上传结果

### 6. 获取评估基准列表

- **路径**: `/api/evaluation/databases/{db_id}/benchmarks`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **响应**: `200` - 基准列表

### 7. 生成评估基准

- **路径**: `/api/evaluation/databases/{db_id}/benchmarks/generate`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求体**: 参数对象 (JSON)
- **响应**: `200` - 生成结果

### 8. 运行RAG评估

- **路径**: `/api/evaluation/databases/{db_id}/run`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求体**: 参数对象 (JSON)
- **响应**: `200` - 评估结果

### 9. 获取评估历史

- **路径**: `/api/evaluation/databases/{db_id}/history`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **响应**: `200` - 历史记录

---

## 思维导图接口

### 1. 获取知识库文件列表

- **路径**: `/api/mindmap/databases/{db_id}/files`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **响应**: `200` - 文件列表

### 2. 生成思维导图

- **路径**: `/api/mindmap/generate`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **请求体**:
  ```json
  {
    "db_id": "string",
    "file_ids": ["string"],
    "user_prompt": "string"
  }
  ```
- **响应**: `200` - Markmap格式思维导图

### 3. 获取知识库概览

- **路径**: `/api/mindmap/databases`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - 知识库列表

### 4. 获取知识库思维导图

- **路径**: `/api/mindmap/database/{db_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **响应**: `200` - 思维导图数据

### 5. 保存知识库思维导图

- **路径**: `/api/mindmap/database/{db_id}`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `db_id` (路径参数)
- **请求体**: 思维导图数据 (JSON对象)
- **响应**: `200` - 保存结果

---

## 知识图谱接口

### 1. 获取知识图谱列表

- **路径**: `/api/graph/list`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - 图谱列表

### 2. 获取子图

- **路径**: `/api/graph/subgraph`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `db_id` (required): 图谱ID
  - `node_label` (可选): 节点标签，默认"\*"
  - `max_depth` (可选): 最大深度，默认2，范围1-5
  - `max_nodes` (可选): 最大节点数，默认100，范围1-1000
- **响应**: `200` - 子图数据

### 3. 获取图谱标签

- **路径**: `/api/graph/labels`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `db_id` (required): 图谱ID
- **响应**: `200` - 标签列表

### 4. 获取图谱统计

- **路径**: `/api/graph/stats`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `db_id` (required): 图谱ID
- **响应**: `200` - 统计信息

### 5. 获取LightRAG子图 (已弃用)

- **路径**: `/api/graph/lightrag/subgraph`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `db_id` (required)
  - `node_label` (required)
  - `max_depth` (可选)
  - `max_nodes` (可选)

### 6. 获取LightRAG知识库 (已弃用)

- **路径**: `/api/graph/lightrag/databases`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)

### 7. 获取LightRAG标签 (已弃用)

- **路径**: `/api/graph/lightrag/labels`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)

### 8. 获取LightRAG统计 (已弃用)

- **路径**: `/api/graph/lightrag/stats`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)

### 9. 获取Neo4j节点 (已弃用)

- **路径**: `/api/graph/neo4j/nodes`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)

### 10. 获取Neo4j单个节点 (已弃用)

- **路径**: `/api/graph/neo4j/node`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)

### 11. 获取Neo4j信息

- **路径**: `/api/graph/neo4j/info`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **响应**: `200` - Neo4j信息

### 12. 为Neo4j索引实体

- **路径**: `/api/graph/neo4j/index-entities`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **请求体**: 可选数据对象
- **响应**: `200` - 索引结果

### 13. 添加Neo4j实体

- **路径**: `/api/graph/neo4j/add-entities`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **请求体**:
  ```json
  {
    "file_path": "string",
    "kgdb_name": "string"
  }
  ```
- **响应**: `200` - 添加结果

---

## 任务接口

### 1. 列表任务

- **路径**: `/api/tasks`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **查询参数**:
  - `status` (可选): 任务状态
  - `limit` (可选): 限制数量，范围1-100，默认100
- **响应**: `200` - 任务列表

### 2. 获取单个任务

- **路径**: `/api/tasks/{task_id}`
- **方法**: `GET`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `task_id` (路径参数)
- **响应**: `200` - 任务详情

### 3. 取消任务

- **路径**: `/api/tasks/{task_id}/cancel`
- **方法**: `POST`
- **认证**: 是 (OAuth2PasswordBearer)
- **参数**: `task_id` (路径参数)
- **描述**: 请求取消任务
- **响应**: `200` - 取消结果

---

## 认证和安全

### OAuth2 认证

- 所有需要认证的接口都使用 `OAuth2PasswordBearer` 方案
- Token获取地址: `/api/auth/token`
- Token放在请求头中: `Authorization: Bearer {access_token}`

### Token缓存建议

- Token可缓存30分钟
- 在发送请求前，应检查本地Token是否存在且未过期
- 如果Token过期，自动调用登录接口获取新Token

### 响应格式

- 成功响应 (`200`): JSON格式
- 验证错误 (`422`): 返回HTTPValidationError
  ```json
  {
    "detail": [
      {
        "loc": ["location"],
        "msg": "错误消息",
        "type": "错误类型"
      }
    ]
  }
  ```

---

## 使用示例

### 登录获取Token

```
POST /api/auth/token
Content-Type: application/x-www-form-urlencoded

username=admin&password=123456&grant_type=password
```

### 使用Token请求受保护接口

```
GET /api/auth/me
Authorization: Bearer {access_token}
```

### 创建知识库

```
POST /api/knowledge/databases
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "database_name": "合同审核库",
  "description": "用于审核企业合同的知识库",
  "embed_model_name": "text-embedding-3-small",
  "kb_type": "lightrag"
}
```

### 查询知识库

```
POST /api/knowledge/databases/{db_id}/query
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "query": "合同有哪些风险条款？",
  "meta": {}
}
```

---

**API文档生成时间**: 2025-12-20
**OpenAPI版本**: 3.1.0
**后端框架**: FastAPI
