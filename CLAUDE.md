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

---

## 核心技术点

### 1. 文件路由系统（Expo Router）
- **自动路由生成**: 基于 `app/` 目录结构自动生成路由
- **动态路由**: `[id]` 语法支持动态参数
- **分组路由**: `(groupName)` 创建逻辑分组
- **类型安全**: TypedRoutes 自动生成路由类型
- **深链接**: 支持 scheme 和 web 深链接

### 2. 状态管理
- **useState**: 组件级状态（meetingList、loading等）
- **useRef**: 保存定时器和状态值，避免内存泄漏
- **useEffect**: 生命周期管理，数据获取和清理
- **无Redux**: 当前项目足够简单，无需全局状态库

### 3. 异步数据流
```typescript
// 典型的数据获取模式
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await apiService.getData();
    setData(data);
    setError(null);
  } catch (err) {
    setError(err);
    Toast.show({ type: 'error', text1: '加载失败' });
  } finally {
    setLoading(false);
  }
};
```

### 4. 本地存储策略
- **异步操作**: AsyncStorage 是异步的，需要 await
- **错误处理**: 存储失败（存储满等）需要try-catch
- **数据类型**: 仅支持字符串，需手动序列化/反序列化JSON
- **性能**: 避免存储大量数据，建议 <5MB

### 5. API 请求优化
```typescript
// Token 缓存检查逻辑
const getTenantToken = async () => {
  const [token, expireTime] = await Promise.all([
    getStorage(STORAGE_KEYS.TENANT_TOKEN),
    getStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME)
  ]);
  
  // 检查是否有效
  if (token && Date.now() < Number(expireTime)) {
    return token;  // 有效则直接返回
  }
  
  // 过期则请求新 token
  return requestNewToken();
};
```

### 6. 定时器管理
```typescript
// 使用 useRef 保存定时器 ID
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  timerRef.current = setInterval(() => {
    fetchData();
  }, 60 * 1000);
  
  // 重要: 组件卸载时清理定时器
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

### 7. 手势识别（DebugPanel）
- **页面坐标**: 使用 `e.nativeEvent.pageX/pageY`（跨平台兼容）
- **四角检测**: 80px × 80px 触发区域
- **序列验证**: 顺时针 0→1→2→3
- **超时重置**: 5秒内未完成则重置

### 8. 条件渲染和状态管理
```typescript
// 三态管理
if (meetRoomDataStatus === "error") {
  return <NoMeeting dataStatus="error_meeting" />;
}

if (meetRoomDataStatus === "empty") {
  return <NoMeeting dataStatus="no_meeting" />;
}

return <MeetingInfo {...meetingData} />;
```

### 9. 列表渲染优化
- **FlatList**: 滚动列表必须指定 `keyExtractor`
- **ListEmptyComponent**: 处理空列表状态
- **scrollEnabled**: 内容不足时禁用滚动
- **removeClippedSubviews**: 虚拟化大列表

### 10. 动画效果
- **闪烁效果**: 使用 Reanimated 2.0 实现进行中状态闪烁
- **性能**: 避免频繁创建新 Animated 对象
- **Native驱动**: 使用 `useNativeDriver: true` 提升性能

---

## 开发规范

### 文件命名
- **组件**: 文件夹 + index.tsx（如 `Header/index.tsx`）
- **工具函数**: camelCase（如 `apiService.ts`）
- **常量**: UPPER_SNAKE_CASE（如 `STORAGE_KEYS`）

### 代码结构
```typescript
// 1. 导入
import React, { useState, useEffect } from 'react';

// 2. 类型定义
interface Props { ... }

// 3. 组件定义
const MyComponent = ({ prop1, prop2 }: Props) => {
  // 3.1 状态声明
  const [state, setState] = useState();
  
  // 3.2 副作用
  useEffect(() => { ... }, []);
  
  // 3.3 事件处理
  const handleEvent = () => { ... };
  
  // 3.4 条件渲染
  if (loading) return <Loading />;
  
  // 3.5 返回JSX
  return <View>...</View>;
};

// 4. 样式
const styles = StyleSheet.create({ ... });

// 5. 导出
export default MyComponent;
```

### TypeScript 最佳实践
- **避免 any**: 使用具体类型或 unknown
- **接口优先**: 用 interface 定义数据结构
- **泛型**: API 返回数据使用泛型
- **常量类型**: 使用 as const 获得字面量类型

```typescript
const ROOM_STATUS = {
  EMPTY: 'empty',
  BUSY: 'busy',
  ERROR: 'error'
} as const;

type RoomStatus = typeof ROOM_STATUS[keyof typeof ROOM_STATUS];
```

### 错误处理
```typescript
// 总是包装 API 调用
try {
  const response = await apiService.getData();
  // 检查业务级错误码
  if (response.data?.code !== 0) {
    throw new Error(response.data?.msg);
  }
  return response.data;
} catch (error) {
  console.error('操作失败:', error);
  Toast.show({
    type: 'error',
    text1: '错误',
    text2: error instanceof Error ? error.message : '未知错误'
  });
  throw error;  // 让调用方决定如何处理
}
```

### 注释规范
- **文件顶部**: 简述组件功能
- **复杂逻辑**: 解释为什么这样做，而不是做什么
- **关键步骤**: 标记重要流程（如Token缓存检查）
- **TODO**: 标记待完成项，用 `// TODO: 描述`

---

## 常见问题排查

### Q: Toast 在 Android 11 平板上看不到
**A**: 
- 检查 Toast 位置：改用 `position: 'bottom'`
- 检查 zIndex：确保 Toast 在最上层
- 清缓存重启：`npm start -- -c`
- 检查 Toast 配置：在根 _layout.tsx 中正确挂载

### Q: FlatList 在 Android 上不显示
**A**:
- 确保父容器有 `flex: 1` 或显式高度
- 检查 data 是否为空数组
- 添加 `ListEmptyComponent` 调试空态
- 检查 renderItem 是否正常返回

### Q: 四角点击检测在 Web 上无效
**A**:
- 使用 `pageX/pageY` 而非 `clientX/clientY`
- 检查坐标系统：document vs element 相对位置
- 在浏览器 DevTools 中打印坐标值调试

### Q: Token 过期导致 API 请求失败
**A**:
- 检查本地存储的过期时间
- 手动清除 AsyncStorage：`await StorageService.removeStorage(STORAGE_KEYS.TENANT_TOKEN)`
- 重新启动应用会自动请求新 Token

### Q: 定时刷新导致内存泄漏
**A**:
- 确保 useEffect cleanup 函数清理定时器
- 使用 `useRef` 保存定时器 ID
- 避免在定时器回调中创建新对象

---

## 调试技巧

### 启用详细日志
在 `utils/ApiService.ts` 已经集成了请求/响应日志：
```
🔵 REQUEST  — 蓝色：请求即将发送
✅ RESPONSE — 绿色：响应成功返回
❌ ERROR    — 红色：请求或响应出错
```

### 检查本地存储
```typescript
// 在 Chrome DevTools 的控制台执行
await AsyncStorage.getItem('meeting_room_id');
await AsyncStorage.getAllKeys();
await AsyncStorage.clear();  // 清除所有存储
```

### 触发调试面板
顺时针点击屏幕四个角落：
```
┌─ 左上(0)
│  ┌─ 右上(1)
│  │  ┌─ 右下(2)
│  │  │  ┌─ 左下(3)
└──┴──┴──┘
```

### 网络监控
在 Flipper 中安装 Feishu API 插件，或在浏览器开发者工具中查看 Network 标签。

---

## 性能优化建议

### 1. 减少重新渲染
- 使用 React.memo 包装不需要频繁更新的子组件
- 避免在 render 中定义函数和对象
- 使用 useCallback 缓存回调函数

### 2. 优化列表性能
- FlatList 必须有 keyExtractor
- 避免在列表项中执行复杂计算
- 使用 useMemo 缓存计算结果

### 3. 网络性能
- Token 缓存减少认证请求
- 60秒刷新频率平衡实时性和带宽
- 合并多个 API 请求为并行调用

### 4. 存储性能
- 避免频繁读写 AsyncStorage
- 使用 Promise.all 并行读取多个 key
- 存储数据量 <1MB 最佳

---

## 未来扩展方向

1. **多语言支持**: 集成 i18n 库
2. **暗黑模式**: 利用 React Native 的 ColorScheme
3. **数据分析**: 接入友盟或 Sentry
4. **离线支持**: SQLite 本地数据库
5. **推送通知**: FCM/APNs 集成
6. **会议链接**: 点击加入会议直接跳转

---

## 资源链接

- [Expo 官方文档](https://docs.expo.dev/)
- [React Native 文档](https://reactnative.dev/)
- [Expo Router 指南](https://docs.expo.dev/router/introduction/)
- [飞书开放平台](https://open.feishu.cn/)
- [AsyncStorage API](https://react-native-async-storage.github.io/)
- [Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/)
