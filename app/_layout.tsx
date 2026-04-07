import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
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
        {/* 会议详情 */}
        <Stack.Screen
          name="meeting/meeting-detail"
          options={{ headerShown: false, title: "MeetBoard" }} // 隐藏导航栏
        />
        {/* 错误页面 */}
        <Stack.Screen
          name="error"
          options={{ headerShown: false }} // 隐藏导航栏
        />
      </Stack>
    </>
  );
}
