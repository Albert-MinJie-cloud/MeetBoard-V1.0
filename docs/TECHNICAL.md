# MeetBoard V1.0 技术文档

## 📋 项目概述

**MeetBoard V1.0** 是一个基于 React Native + Expo 开发的会议室智能看板应用。专为会议室投屏设备设计（横屏展示），通过集成飞书（Feishu）开放平台 API，实时显示会议室当前和后续会议信息。

**核心用途**: 会议室门口/走廊投屏设备，让与会者快速了解会议室状态和时间

**支持平台**: 
- 🔴 Android 投屏设备（主要目标）
- 🍎 iOS
- 🌐 Web

---

## 🔧 技术栈

### 核心框架
- **Expo SDK**: ~54.0.33 — 快速开发和构建工具链
- **React**: 19.1.0 — UI库和状态管理
- **React Native**: 0.81.5 — 跨平台原生开发
- **TypeScript**: ~5.9.2 — 类型安全

### 路由和导航
- **Expo Router**: ~6.0.23 — 基于文件的路由系统（类似Next.js）
  - 自动生成路由
  - 类型安全的动态路由
  - 深链接支持

### 样式和动画
- **React Native StyleSheet**: 原生样式系统
- **react-native-reanimated**: ~4.1.1 — 高性能动画库（用于状态闪烁效果）
- **react-native-gesture-handler**: ~2.28.0 — 手势识别（四角触摸检测）

### 网络和数据
- **axios**: ^1.14.0 — HTTP客户端（飞书API请求）
  - 请求/响应拦截器
  - 自动超时控制（15秒）
  - 错误日志打印

### 本地存储
- **@react-native-async-storage**: 2.2.0 — 异步本地存储
  - 存储API凭证（ROOM_ID、APP_ID、APP_SECRET）
  - 存储Token缓存和过期时间

### UI和通知
- **react-native-toast-message**: ^2.3.3 — 轻量级提示框
  - 错误提示
  - 成功反馈
- **@expo/vector-icons**: ^15.0.3 — 图标库

### 开发工具
- **ESLint**: ^9.25.0 — 代码检查
- **Metro**: React Native打包工具（已集成）

---

## 📁 项目结构

```
MeetBoard-V1.0/
├── app/                              # Expo Router 路由目录
│   ├── _layout.tsx                   # 根布局：隐藏状态栏、Toast配置
│   ├── error.tsx                     # 全局错误边界
│   └── (tabs)/
│       ├── _layout.tsx               # Tabs布局（当前仅一个tab）
│       └── index.tsx                 # 首页主看板入口
│
├── components/                       # UI组件库
│   ├── Header/
│   │   └── index.tsx                 # 顶部头部
│   │       ├── 会议室名称
│   │       ├── 当前日期和星期
│   │       └── 当前时间（实时更新）
│   │
│   ├── MeetingBoard/
│   │   └── index.tsx                 # 核心数据容器
│   │       ├── 数据获取逻辑
│   │       ├── 60秒自动刷新
│   │       ├── 错误处理
│   │       └── 加载状态
│   │
│   ├── MainContent/
│   │   └── index.tsx                 # 内容布局（左右分屏）
│   │       ├── 左侧：当前会议卡片
│   │       └── 右侧：后续会议列表
│   │
│   ├── CurrentMeetingInfo/
│   │   └── index.tsx                 # 当前会议卡片
│   │       ├── 会议时间
│   │       ├── 会议主题
│   │       └── 预约人信息
│   │
│   ├── NextMeetingInfo/
│   │   └── index.tsx                 # 后续会议列表（FlatList）
│   │       ├── 可滚动列表
│   │       ├── 列表项样式
│   │       └── 空态处理
│   │
│   ├── MeetingStatus/
│   │   └── index.tsx                 # 状态指示器
│   │       ├── 空闲（绿色）
│   │       ├── 进行中（红色闪烁）
│   │       └── 异常（灰色）
│   │
│   ├── NoMeeting/
│   │   └── index.tsx                 # 空态提示
│   │       ├── 无会议
│   │       └── 数据异常
│   │
│   ├── InitModal/
│   │   └── index.tsx                 # 配置初始化弹窗
│   │       ├── ROOM_ID 输入
│   │       ├── APP_ID 输入
│   │       ├── APP_SECRET 输入
│   │       ├── 验证逻辑
│   │       └── 本地存储
│   │
│   └── DebugPanel/
│       └── index.tsx                 # 隐藏调试面板
│           ├── 四角检测
│           ├── 顺时针序列验证
│           ├── 调试按钮触发
│           └── 自动隐藏逻辑
│
├── utils/                            # 工具层
│   ├── ApiService.ts                 # 飞书API接口层
│   │   ├── getTenantToken()          # 获取Access Token
│   │   ├── getFreeBusyMeetingRoom()  # 查询忙闲时间段
│   │   ├── getMeetingRoomSummary()   # 查询会议详情
│   │   └── getMeetingRoomName()      # 查询会议室名称
│   │
│   ├── StorageService.ts             # 本地存储封装
│   │   ├── getStorage()              # 读取
│   │   ├── setStorage()              # 写入
│   │   ├── removeStorage()           # 删除
│   │   └── STORAGE_KEYS              # 键常量
│   │
│   └── Time.ts                       # 时间工具
│       ├── getHourMinute()           # 格式化时间
│       ├── getMeetingStatus()        # 判断会议状态
│       ├── toFeishuDateTime()        # 转换为飞书格式
│       └── 其他时间处理函数
│
├── assets/                           # 静态资源
│   └── images/                       # 图标和背景
│       └── icon.png                  # 应用图标
│
├── app.json                          # Expo应用配置
│   ├── 包名和版本
│   ├── 屏幕方向（强制横屏）
│   ├── iOS配置
│   ├── Android配置
│   └── Web配置
│
├── package.json                      # NPM依赖配置
├── tsconfig.json                     # TypeScript配置（路径别名）
├── babel.config.js                   # Babel配置（@/ 别名）
├── eslint.config.js                  # ESLint规则
├── CLAUDE.md                         # Claude开发指南
└── README.md                         # 项目说明
```

---

## 🔄 数据流架构

### 初始化流程

```
应用启动
    ↓
app._layout.tsx
    ├─ 隐藏StatusBar
    ├─ 挂载Toast通知系统
    └─ 包含(tabs)路由
         ↓
    (tabs)/index.tsx
         ├─ 检查本地ROOM_ID
         │   ├─ 未存在 → 显示InitModal
         │   │   └─ 用户输入ROOM_ID/APP_ID/APP_SECRET
         │   │       └─ 存储到AsyncStorage
         │   └─ 已存在 → 显示MeetingBoard
         │       └─ 跳过InitModal
         │
         └─ MeetingBoard组件
             └─ 开始数据拉取循环
```

### 数据获取流程

```
MeetingBoard.fetchData() 启动
    ↓
1️⃣  getTenantToken()
    ├─ 检查本地token是否有效
    │   ├─ 有效且未过期 → 直接返回
    │   └─ 过期或不存在 → 请求新token
    │       ├─ POST /auth/v3/tenant_access_token/internal
    │       └─ 存储token和过期时间（本地2小时有效期）
    └─ 返回token
         ↓
    ┌─────────────────────────────────┐
    │  并行请求3个API接口              │
    └─────────────────────────────────┘
         ↙          ↓          ↖
    2️⃣ API1      3️⃣ API2     4️⃣ API3
    │          │          │
    │          │          │
    v          v          v
 getMeeting  getFreeB   getMeeting
 RoomName   usyMeeting RoomSummary
            Room
    │          │          │
    └──────────┼──────────┘
              ↓
    数据合并和状态更新
         ↓
    ├─ 无会议 → meetRoomDataStatus = "empty"
    ├─ 异常 → meetRoomDataStatus = "error"
    └─ 有会议 → meetRoomDataStatus = "haveMeeting"
         ↓
    组件渲染
         ↓
    60秒后重复
```

### 飞书API集成

#### 1. 获取Access Token
```http
POST /auth/v3/tenant_access_token/internal
Content-Type: application/json

{
  "app_id": "xxxx",
  "app_secret": "xxxx"
}

返回:
{
  "code": 0,
  "tenant_access_token": "xxxx",
  "expire": 7200
}
```

#### 2. 查询会议室忙闲
```http
GET /meeting_room/freebusy/batch_get?room_ids=xxx&time_min=xxx&time_max=xxx
Authorization: Bearer {token}

返回:
{
  "code": 0,
  "data": {
    "free_busy": {
      "room_id_1": [
        {
          "uid": "xxxxx",
          "original_time": 1234567890,
          "start_time": "2024-01-01 10:00:00",
          "end_time": "2024-01-01 11:00:00"
        }
      ]
    }
  }
}
```

#### 3. 查询会议详情（主题/组织者）
```http
POST /meeting_room/summary/batch_get
Authorization: Bearer {token}
Content-Type: application/json

{
  "EventUids": [
    {"uid": "xxxxx", "original_time": 1234567890}
  ]
}

返回:
{
  "code": 0,
  "data": {
    "EventInfos": [
      {
        "uid": "xxxxx",
        "summary": "产品设计评审",
        "organizer_info": {"name": "张三"}
      }
    ]
  }
}
```

#### 4. 查询会议室名称
```http
POST /vc/v1/rooms/mget
Authorization: Bearer {token}
Content-Type: application/json

{
  "room_ids": ["room_id_1"]
}

返回:
{
  "code": 0,
  "data": {
    "items": [
      {"id": "room_id_1", "name": "会议室A"}
    ]
  }
}
```

---

## 💾 本地存储架构

使用 AsyncStorage 存储关键配置和缓存：

```typescript
STORAGE_KEYS = {
  // 用户配置
  ROOM_ID: "meeting_room_id",           // 会议室ID
  APP_ID: "meeting_app_id",             // 飞书应用ID
  APP_SECRET: "meeting_app_secret",     // 飞书应用密钥
  
  // Token缓存
  TENANT_TOKEN: "tenant_access_token",  // Access Token
  TOKEN_EXPIRE_TIME: "token_expire_time" // 过期时间戳（13位）
}
```

**Token缓存策略**:
- 首次请求Token时，存储到期时间 = 当前时间 + 7200秒（2小时）
- 后续请求前检查：`现在时间 < 存储的到期时间`
- 未过期使用本地Token，避免重复请求
- 过期自动请求新Token

---

## 🎨 UI设计系统

### 色彩系统

| 用途 | 颜色 | 十六进制 |
|------|------|----------|
| 主色（蓝） | 品牌蓝 | `#1677ff` |
| 背景色 | 浅灰 | `#F5F7F9` |
| 会议时间 | 蓝 | `#1677ff` |
| 会议主题 | 深灰 | `#1d2129` |
| 标签文本 | 中灰 | `#999` |
| 辅助文本 | 浅灰 | `#86909c` |
| 空闲状态 | 绿 | `#90C36B` |
| 进行中状态 | 红 | `#E62E2E` |
| 异常状态 | 灰 | `#999999` |

### 排版系统

| 用途 | 大小 | 权重 |
|------|------|------|
| 页面标题 | 28px | 700 |
| 会议主题 | 30px | 700 |
| 子标题 | 24px | 600 |
| 普通文本 | 16px | 400 |
| 小文本 | 12-14px | 400 |

### 间距系统

- **gap**: 20px ~ 60px（flex容器间距）
- **padding**: 32px ~ 60px（容器内边距）
- **margin**: 尽量避免，优先使用gap和padding
- **borderRadius**: 12px ~ 16px（圆角）

### 阴影系统

```javascript
shadowColor: "#000",
shadowOffset: { width: 0, height: 4 },      // 4px 向下
shadowOpacity: 0.1,                         // 10% 透明度
shadowRadius: 6,                            // 6px 模糊
elevation: 4,                               // Android 阴影
```

### 布局系统

**首页布局** (MainContent):
- Header: 固定 120px 高
- 内容区: flex:1 分屏
  - 左侧 (60%)：当前会议卡片
    - MeetingStatus（状态指示器）
    - CurrentMeetingInfo（卡片）
  - 右侧 (40%)：后续会议列表
    - NextMeetingInfo（可滚动）

**响应式设计**:
- 强制横屏（app.json: `"orientation": "landscape"`）
- 隐藏状态栏（app/_layout.tsx）
- 使用flex布局，避免固定尺寸
- FlatList指定contentContainerStyle确保高度

---

## 🎯 核心功能模块

### 1. 会议室配置模块

**文件**: `components/InitModal/index.tsx`

**职责**:
- 首次使用引导用户输入配置
- 参数验证（非空检查）
- 本地存储保存
- 编辑模式支持（通过DebugPanel触发）

**功能**:
```typescript
- 三个输入框：ROOM_ID、APP_ID、APP_SECRET
- 取消按钮（编辑模式下显示）
- 确定按钮（保存配置）
- Toast提示反馈
```

### 2. 数据加载模块

**文件**: `components/MeetingBoard/index.tsx`

**职责**:
- 管理数据获取生命周期
- 60秒自动刷新逻辑
- 错误处理和重试
- 加载状态反馈

**核心逻辑**:
```javascript
// 初始化
useEffect(() => {
  fetchData();  // 首次加载
  timerRef.current = setInterval(fetchData, 60 * 1000);
  
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

### 3. 调试面板模块

**文件**: `components/DebugPanel/index.tsx`

**职责**:
- 隐藏入口（四角点击序列）
- 触发配置编辑
- 自动隐藏逻辑

**触发机制**:
```
顺时针点击四个角落序列:
┌─────────────┐
│0    →    1 │
│            │
│            │
│3    ←    2 │
└─────────────┘

正确序列: 0 → 1 → 2 → 3 (顺时针)
错误序列: 重置计时器，重新开始
```

**每个角落检测范围**: 80px × 80px

**超时机制**: 5秒内未完成序列则重置

### 4. 时间工具模块

**文件**: `utils/Time.ts`

**核心函数**:

```typescript
// 将时间戳转换为 "HH:mm" 格式
getHourMinute(timestamp: string): string

// 判断会议状态（"未开始" | "进行中" | "已结束"）
getMeetingStatus(startTime: string, endTime: string): string

// 将Date转换为飞书API格式（"YYYY-MM-DD HH:mm:ss"）
toFeishuDateTime(date: Date): string
```

---

## 🔌 API请求拦截器

### 请求拦截
```javascript
feishuAxios.interceptors.request.use(
  (config) => {
    console.log(`🔵 REQUEST [${config.method?.toUpperCase()}]`);
    console.log(`URL: ${config.baseURL}${config.url}`);
    console.log(`Headers:`, config.headers);
    console.log(`Body:`, config.data);
    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);
```

### 响应拦截
```javascript
feishuAxios.interceptors.response.use(
  (response) => {
    console.log(`✅ RESPONSE [${response.status}]`);
    console.log(`Data:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ RESPONSE ERROR [${error.response?.status}]`);
    console.error(`Message:`, error.message);
    console.error(`Response:`, error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## 📱 平台特性

### Android（投屏设备）
- ✅ 强制横屏（landscape）
- ✅ 隐藏状态栏
- ✅ 最小SDK 30（Android 11+）
- ✅ 启用 Edge-to-Edge 显示
- ✅ 自适应图标支持

### iOS
- ✅ 自动旋转支持
- ✅ 安全区域适配
- ✅ 深色模式支持

### Web
- ✅ 响应式布局
- ✅ 本地存储支持
- ✅ 坐标事件兼容性处理

---

## 🔐 安全建议

⚠️ **重要提示**:

1. **API凭证保护**
   - 勿将 APP_ID 和 APP_SECRET 硬编码在代码中
   - 建议使用环境变量或后端代理服务器
   - 本项目当前使用本地AsyncStorage存储，仅供开发使用

2. **Token安全**
   - Token存储在本地AsyncStorage（纯文本）
   - 建议在生产环境使用更安全的存储方式（Keychain/Keystore）
   - Token有效期默认2小时，自动续期

3. **网络通信**
   - 所有飞书API请求使用HTTPS
   - 请求超时设置为15秒
   - 建议添加请求签名验证

---

## 🚀 部署指南

### 开发环境运行

```bash
# 清缓存启动
npm start -- -c

# 选择平台
# a: Android
# i: iOS
# w: Web
```

### Android模拟器

```bash
npm run android
```

### iOS模拟器

```bash
npm run ios
```

### Web浏览器

```bash
npm run web
```

### 生产构建

```bash
# 使用EAS Build（推荐）
npx eas build --platform android

# 本地构建
npx expo run:android --build
```

---

## 📊 性能优化

1. **Token缓存**
   - 减少重复的Token请求
   - 每次API调用前检查有效性

2. **定时刷新间隔**
   - 60秒更新一次数据
   - 平衡实时性和网络消耗

3. **组件优化**
   - FlatList使用keyExtractor
   - 避免在render中创建新对象
   - 使用React.memo优化子组件

4. **内存管理**
   - 定时器正确清理（useEffect返回函数）
   - 避免内存泄漏

---

## 🐛 常见问题

### Q: Token过期怎么处理？
A: 系统自动检查本地存储的过期时间，过期时重新请求新Token。如果API返回401，需要手动触发Token刷新。

### Q: 网络异常怎么反馈？
A: 错误通过Toast提示用户，Console打印详细日志便于调试。建议检查网络和API端点配置。

### Q: 如何修改会议室配置？
A: 点击屏幕四个角落顺序（顺时针）触发调试面板，显示修改按钮。

### Q: 支持多语言吗？
A: 当前仅中文，所有文案硬编码。可通过i18n库扩展多语言支持。

---

## 📝 版本历史

- **v1.0.0** (2024): 初版发布
  - 基础会议展示功能
  - 飞书API集成
  - 隐藏调试面板
  - 跨平台支持

---

本文档持续更新，最后修改时间：2026年4月
