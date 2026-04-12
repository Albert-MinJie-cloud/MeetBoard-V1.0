import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";

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
      </Stack>
      <Toast />
    </>
  );
}
