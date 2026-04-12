import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface IndexProps {
  isMeetingActive: boolean;
  meetRoomDataStatus: "empty" | "error" | "haveMeeting";
}

const MeetingStatus = ({
  isMeetingActive = true,
  meetRoomDataStatus,
}: IndexProps) => {
  const statusText = () => {
    if (meetRoomDataStatus === "error") {
      return "异常";
    }
    if (meetRoomDataStatus === "empty") {
      return "空闲";
    }
    if (meetRoomDataStatus === "haveMeeting" && isMeetingActive) {
      return "会议进行中";
    }
  };

  const dotOpacity = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isMeetingActive) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      dotOpacity.setValue(0);
    }
  }, [isMeetingActive, dotOpacity]);

  return (
    <View
      style={[
        styles.statusContainer,
        meetRoomDataStatus === "error" && styles.inactiveContainer,
        meetRoomDataStatus === "empty" && styles.emptyContainer,
        meetRoomDataStatus === "haveMeeting" &&
          isMeetingActive &&
          styles.activeContainer,
      ]}
    >
      {isMeetingActive && (
        <Animated.View style={[styles.flashDot, { opacity: dotOpacity }]} />
      )}
      <Text style={styles.meetingStatusText}>{statusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    gap: 8,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // 对应 0 4px
    shadowOpacity: 0.1, // 对应 10% 透明度
    shadowRadius: 6, // 对应 6px 模糊
    // Android 阴影（必须加）
    elevation: 4,
  },
  activeContainer: {
    backgroundColor: "#E62E2E",
  },
  inactiveContainer: {
    backgroundColor: "#999999",
  },
  emptyContainer: {
    backgroundColor: "#90C36B",
  },
  meetingStatusText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  flashDot: {
    width: 12,
    height: 12,
    borderRadius: 6, // 圆形
    backgroundColor: "white",
  },
});

export default MeetingStatus;
