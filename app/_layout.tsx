import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function RootLayout() {
  // 保持启动屏不自动关闭
  SplashScreen.preventAutoHideAsync();

  // 加载你的字体
  const [fontsLoaded, error] = useFonts({
    Source_Han_Sans_Heavy: require("../assets/fonts/Source_Han_Sans_SC_Heavy_Heavy.otf"),
  });

  // 字体加载完成后，再隐藏启动屏
  useEffect(() => {
    if (error) {
      console.error("字体加载失败:", error);
      SplashScreen.hideAsync();
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // 👇 字体没加载完 → 不渲染任何页面（彻底解决字体闪烁/不显示）
  if (!fontsLoaded) {
    return null;
  }

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
