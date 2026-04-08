import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Header from "@/components/Header";
import MainContent from "@/components/MainContent";

interface IndexProps {
  clearRoomId: () => void;
}

const Index = ({ clearRoomId }: IndexProps) => {
  return (
    <View style={styles.meetingBoardContainer}>
      <Header />
      <MainContent />
      {/* 会议室详情组件 */}
      <Text onPress={clearRoomId}>清空会议室ID</Text>
    </View>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  meetingBoardContainer: {
    flex: 1,
    backgroundColor: "#3b70ff",
  },
});

export default Index;
