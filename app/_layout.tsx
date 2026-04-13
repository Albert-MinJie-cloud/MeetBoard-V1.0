import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";

export default function RootLayout() {
  // 👇 第一步：配置右下角样式（全局生效）
  const toastConfig = {
    // 错误类型 toast
    error: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        // 核心：右下角样式
        style={{
          position: "absolute",
          bottom: -16, // 距离底部
          right: 24, // 距离右侧
          width: "auto", // 自适应宽度
          minWidth: 260, // 最小宽度
        }}
      />
    ),
  };

  return (
    <>
      {/* 隐藏状态栏（投屏设备无需显示） */}
      <StatusBar hidden={true} />
      {/* 路由栈 */}
      <Stack>
        <Stack.Screen
          name="(tabs)/index"
          options={{ headerShown: false, title: "MeetBoard" }} // 隐藏导航栏
        />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}
