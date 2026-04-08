import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import {
  getStorage,
  setStorage,
  removeStorage,
  STORAGE_KEYS,
} from "@/utils/StorageService";

import RoomIdModal from "@/components/RoomIdModal";
import MeetingBoard from "@/components/MeetingBoard";

const Index = () => {
  // 弹窗显示控制
  const [modalVisible, setModalVisible] = useState(false);

  // 展示详情组件
  const [showDetails, setShowDetails] = useState(false);

  // 初始化：检查roomId
  useEffect(() => {
    const init = async () => {
      const roomId = await getStorage(STORAGE_KEYS.ROOM_ID);
      if (roomId) {
        // 已有roomId，直接进入会议室
        // 这里可以添加导航逻辑，例如使用React Navigation跳转到会议室界面
        console.log("已有roomId，进入会议室:", roomId);
        setShowDetails(true);
      } else {
        // 无roomId，显示弹窗
        setModalVisible(true);
      }
    };

    init();
  }, []);

  // 保存roomId
  const handleSaveRoomId = async (roomId: string) => {
    await setStorage(STORAGE_KEYS.ROOM_ID, roomId);
    setModalVisible(false);
    setShowDetails(true);
  };

  // 清空roomId
  const clearRoomId = async () => {
    await removeStorage(STORAGE_KEYS.ROOM_ID);
    setShowDetails(false);
    setModalVisible(true);
  };

  if (showDetails) {
    // 这里可以返回会议室详情组件
    return (
      <View style={styles.container}>
        <MeetingBoard clearRoomId={clearRoomId} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 输入roomId的弹窗 */}
      <RoomIdModal visible={modalVisible} onSave={handleSaveRoomId} />
    </View>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b70ff",
    padding: 20,
  },
});

export default Index;
