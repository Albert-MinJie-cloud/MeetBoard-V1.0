import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

// 接收外部传参：isMeetingActive（是否有会议进行中）
const MeetingStatus = ({ isMeetingActive = true }) => {
  // 根据是否有会议，切换显示文本和样式
  const statusText = isMeetingActive ? "会议进行中" : "无会议";
  // 动画值：控制圆点闪烁
  const dotOpacity = useState(new Animated.Value(1))[0];

  // 会议进行中时，执行圆点闪烁动画
  useEffect(() => {
    if (isMeetingActive) {
      // 无限循环闪烁：1秒显示，1秒隐藏
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
      // 组件卸载时停止动画
      return () => animation.stop();
    } else {
      // 无会议时，圆点不显示
      dotOpacity.setValue(0);
    }
  }, [isMeetingActive, dotOpacity]);

  return (
    <View
      style={[
        styles.statusContainer,
        isMeetingActive ? styles.activeContainer : styles.inactiveContainer,
      ]}
    >
      {/* 闪烁圆点（仅会议进行中显示） */}
      {isMeetingActive && (
        <Animated.View style={[styles.flashDot, { opacity: dotOpacity }]} />
      )}
      {/* 状态文本 */}
      <Text style={styles.meetingStatusText}>{statusText}</Text>
    </View>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  // 容器样式（宽度不撑满，自适应内容）
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 15, // 左右内边距
    paddingVertical: 5, // 上下内边距
    marginBottom: 20,
    // 宽度自适应内容（不撑满）
    alignSelf: "flex-start",
    gap: 8, // 圆点和文本的间距
  },
  // 会议进行中：红色背景
  activeContainer: {
    backgroundColor: "#E62E2E",
  },
  // 无会议：灰色背景
  inactiveContainer: {
    backgroundColor: "#999999",
  },
  // 文本样式
  meetingStatusText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  // 闪烁圆点样式
  flashDot: {
    width: 12,
    height: 12,
    borderRadius: 6, // 圆形
    backgroundColor: "white",
  },
});

export default MeetingStatus;
