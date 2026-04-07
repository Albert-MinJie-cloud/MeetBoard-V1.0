# MeetBoard V1.0

一个基于 React Native 和 Expo 开发的会议管理应用。

## 项目简介

MeetBoard 是一款跨平台的会议管理工具，支持 iOS、Android 和 Web 平台。通过直观的界面帮助用户轻松管理和查看会议信息。

## 技术栈

- **框架**: React Native 0.81.5 + Expo ~54.0
- **路由**: Expo Router (基于文件的路由系统)
- **UI**: React Native Reanimated + Gesture Handler
- **语言**: TypeScript 5.9
- **状态管理**: AsyncStorage
- **架构**: React 19.1 + React Compiler

## 功能特性

- 会议列表展示
- 会议详情查看
- 底部导航栏
- 响应式布局
- 深色模式支持
- 跨平台兼容

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npx expo start
```

或使用以下命令直接在特定平台运行：

```bash
npm run android  # Android 模拟器
npm run ios      # iOS 模拟器
npm run web      # Web 浏览器
```

### 清除缓存启动

```bash
npx expo start --clear
```

## 项目结构

```
MeetBoard-V1.0/
├── app/                    # 应用页面（基于文件路由）
│   ├── (tabs)/            # 底部导航页面
│   │   └── index.tsx      # 首页
│   ├── meeting/           # 会议相关页面
│   │   └── meeting-detail.tsx
│   ├── _layout.tsx        # 根布局
│   └── error.tsx          # 错误页面
├── components/            # 可复用组件
├── constants/             # 常量配置
├── assets/               # 静态资源
├── utils/                # 工具函数
└── babel.config.js       # Babel 配置
```

## 开发说明

- 使用 `@/` 作为路径别名指向项目根目录
- 启用了 React Compiler 实验性特性
- 支持 TypedRoutes 类型安全路由
- 使用 ESLint 进行代码规范检查

## 代码检查

```bash
npm run lint
```

## 版本信息

- 当前版本: 1.0.0
- Expo SDK: ~54.0
- React: 19.1.0

## 许可证

Private
