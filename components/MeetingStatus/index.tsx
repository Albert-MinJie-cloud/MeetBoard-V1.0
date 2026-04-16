import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface IndexProps {
  isMeetingActive: boolean;
}

const MeetingStatus = ({ isMeetingActive = true }: IndexProps) => {
  const statusText = isMeetingActive ? "会议进行中" : "空闲";

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
        isMeetingActive ? styles.activeContainer : styles.emptyContainer,
      ]}
    >
      {isMeetingActive && (
        <Animated.View style={[styles.flashDot, { opacity: dotOpacity }]} />
      )}
      <Text style={styles.meetingStatusText}>{statusText}</Text>
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
    elevation: 4,
  },
  activeContainer: {
    backgroundColor: "#E62E2E",
  },
  emptyContainer: {
    backgroundColor: "#90C36B",
  },
  meetingStatusText: {
    fontSize: 48,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Source_Han_Sans_SC_Bold",
  },
  flashDot: {
    width: 12,
    height: 12,
    borderRadius: 6, // 圆形
    backgroundColor: "white",
    marginRight: 6,
  },
});

export default MeetingStatus;
