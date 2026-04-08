# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

MeetBoard V1.0 是一个面向会议室投屏设备的横屏看板应用，基于 React Native + Expo 开发，集成飞书（Feishu）会议 API，展示会议室当前和下一场会议状态。

**目标平台**: Android 投屏设备（横屏，隐藏状态栏）| iOS | Web

---

## 开发命令

```bash
npm install           # 安装依赖
npm start            # 启动 Expo 开发服务器
npm start -- -c      # 清除缓存启动
npm run android      # Android 模拟器
npm run ios          # iOS 模拟器
npm run web          # Web
npm run lint         # ESLint 检查
```

---

## 技术栈

- **框架**: Expo SDK 54 + React Native 0.81.5 + React 19.1
- **路由**: Expo Router（基于文件的路由，入口为 `expo-router/entry`）
- **样式**: React Native 内置 StyleSheet
- **动画**: react-native-reanimated + react-native-gesture-handler
- **网络**: axios
- **本地存储**: @react-native-async-storage/async-storage
- **飞书 API 集成**: 自建本地代理服务器（`http://localhost:3000/api/feishu`）

---

## 路径别名

`@/` 指向项目根目录。配置在 `babel.config.js` 和 `tsconfig.json` 中保持同步。

---

## 架构说明

### 路由结构（Expo Router）

```
app/
├── _layout.tsx          # 根布局：隐藏 StatusBar，包含 Stack 路由
├── error.tsx            # 全局错误边界
└── (tabs)/
    └── index.tsx        # 首页（主看板）
```

### 核心数据流（首页）

1. 启动时检查本地 `ROOM_ID` 是否存在
2. 无 `ROOM_ID` → 弹出 Modal 输入框 → 保存后开始拉取
3. 有 `ROOM_ID` → 并行请求 `getFreeBusyMeetingRoom`（忙闲数据）+ `getMeetingRoomSummary`（主题）
4. 每 60 秒自动刷新一次
5. Token 有本地缓存（2 小时有效期），避免重复请求

### 工具层

- `utils/ApiService.ts` — 飞书 API 封装：Token 获取、忙闲查询、主题查询（BASE_URL 默认指向本地代理 `http://localhost:3000/api/feishu`）
- `utils/StorageService.ts` — AsyncStorage 封装：`getStorage`、`setStorage`、`removeStorage`，`STORAGE_KEYS` 统一管理所有本地存储 key

### 飞书 API 集成（安全注意事项）

`utils/ApiService.ts` 中硬编码了飞书 `APP_ID` 和 `APP_SECRET`，请勿将此文件提交到公开仓库。
