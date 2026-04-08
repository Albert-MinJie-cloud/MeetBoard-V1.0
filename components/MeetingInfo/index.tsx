import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * 会议信息展示组件
 * @param {Object} props - 组件属性
 * @param {Object} props.meetingInfo - 会议信息对象（必须包含time/theme/booker字段）
 * @param {StyleSheet} [props.customStyles] - 自定义样式（可选，用于覆盖默认样式）
 */

interface MeetingInfoProps {
  meetingInfo: {
    time: string;
    theme: string;
    booker: string;
  };
  customStyles?: {
    container?: object;
    row?: object;
    label?: object;
    value?: object;
  };
}

const MeetingInfo = ({ meetingInfo, customStyles = {} }: MeetingInfoProps) => {
  // 解构会议信息，添加默认值避免空值报错
  const { time = "暂无", theme = "暂无", booker = "暂无" } = meetingInfo || {};

  return (
    <View style={[styles.meetingInfoContainer, customStyles.container]}>
      {/* 会议时间行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <Text style={[styles.infoLabel, customStyles.label]}>会议时间</Text>
        <Text style={[styles.infoValue, customStyles.value]}>{time}</Text>
      </View>
      {/* 会议主题行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <Text style={[styles.infoLabel, customStyles.label]}>会议主题</Text>
        <Text style={[styles.infoValue, customStyles.value]}>{theme}</Text>
      </View>
      {/* 预约人行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <Text style={[styles.infoLabel, customStyles.label]}>预约人</Text>
        <Text style={[styles.infoValue, customStyles.value]}>{booker}</Text>
      </View>
    </View>
  );
};

// 原有样式迁移（保留原命名，确保样式一致性）
const styles = StyleSheet.create({
  meetingInfoContainer: {
    gap: 15, // 行与行之间的间距
  },
  infoRow: {
    flexDirection: "column", // 标签和值上下排列
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5, // 标签和值的间距
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
});

export default MeetingInfo;
