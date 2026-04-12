import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getHourMinute } from "@/utils/Time";

import NoMeeting from "@/components/NoMeeting";

interface MeetingInfoProps {
  isMeetingActive: boolean;
  meetingInfo: {
    start_time: string;
    end_time: string;
    summary: string;
    organizer_info: {
      name: string;
    };
  };
  customStyles?: {
    container?: object;
    row?: object;
    label?: object;
    value?: object;
  };
}

const MeetingInfo = ({
  isMeetingActive,
  meetingInfo,
  customStyles = {},
}: MeetingInfoProps) => {
  // 解构会议信息，添加默认值避免空值报错

  const {
    start_time = "",
    end_time = "",
    summary = "暂无",
    organizer_info = { name: "暂无" },
  } = meetingInfo || {};

  if (!isMeetingActive) {
    return (
      <View style={[styles.noMeetingInfoContainer, customStyles.container]}>
        <NoMeeting dataStatus="no_meeting" />
      </View>
    );
  }

  return (
    <View style={[styles.meetingInfoContainer, customStyles.container]}>
      {/* 会议时间行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <Text style={[styles.infoLabel, customStyles.label]}>会议时间</Text>
        <Text style={[styles.infoValue, customStyles.value]}>
          {getHourMinute(start_time)} - {getHourMinute(end_time)}
        </Text>
      </View>
      {/* 会议主题行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <Text style={[styles.infoLabel, customStyles.label]}>会议主题</Text>
        <Text style={[styles.infoValue, customStyles.value]}>{summary}</Text>
      </View>
      {/* 预约人行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <Text style={[styles.infoLabel, customStyles.label]}>预约人</Text>
        <Text style={[styles.infoValue, customStyles.value]}>
          {organizer_info?.name}
        </Text>
      </View>
    </View>
  );
};

// 原有样式迁移（保留原命名，确保样式一致性）
const styles = StyleSheet.create({
  meetingInfoContainer: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // 对应 0 4px
    shadowOpacity: 0.1, // 对应 10% 透明度
    shadowRadius: 6, // 对应 6px 模糊
    // Android 阴影（必须加）
    elevation: 4,
  },
  noMeetingInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // 对应 0 4px
    shadowOpacity: 0.1, // 对应 10% 透明度
    shadowRadius: 6, // 对应 6px 模糊
    // Android 阴影（必须加）
    elevation: 4,
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
  // 新增空数据样式
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MeetingInfo;
