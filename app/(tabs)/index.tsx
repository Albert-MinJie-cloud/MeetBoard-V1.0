// app/(tabs)/index.tsx
import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getRoomInfo, saveRoomInfo } from "@/utils/StorageService";
import CustomModal from "@/components/Modal";

export default function MeetBoardMain() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [roomId, setRoomId] = useState("");

  const showRoomIdPrompt = useCallback(() => {
    setShowDialog(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (roomId && roomId.trim()) {
      const roomInfo = { roomId: roomId.trim() };
      await saveRoomInfo(roomInfo);
      setShowDialog(false);
      router.replace({
        pathname: "/meeting/meeting-detail",
      });
    } else {
      Alert.alert("错误", "房间号不能为空");
    }
  }, [roomId, router]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
    setRoomId("");
  }, []);

  // 初始化：校验缓存并跳转对应页面
  React.useEffect(() => {
    const initRouter = async () => {
      const cachedRoomInfo = await getRoomInfo();
      if (cachedRoomInfo) {
        // 有缓存：跳转详情页
        router.replace({
          pathname: "/meeting/meeting-detail",
        });
      } else {
        // 无缓存：弹出输入框
        showRoomIdPrompt();
      }
    };

    initRouter();
  }, [router, showRoomIdPrompt]);

  // 加载完成后由路由跳转，此处仅占位
  return (
    <View style={styles.container}>
      <CustomModal
        visible={showDialog}
        title="输入房间号"
        showInput={true}
        inputValue={roomId}
        inputPlaceholder="请输入房间号"
        onInputChange={setRoomId}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
