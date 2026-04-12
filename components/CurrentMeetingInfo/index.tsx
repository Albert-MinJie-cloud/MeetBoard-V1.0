import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { getHourMinute } from "@/utils/Time";

import NoMeeting from "@/components/NoMeeting";

interface MeetingInfoProps {
  isMeetingActive: boolean;
  meetRoomDataStatus: "empty" | "error" | "haveMeeting";
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
    timeValue?: object;
    titleValue?: object;
    personValue?: object;
    labelText?: object;
  };
}

const MeetingInfo = ({
  isMeetingActive,
  meetingInfo,
  meetRoomDataStatus,
  customStyles = {},
}: MeetingInfoProps) => {
  // 解构会议信息，添加默认值避免空值报错

  const {
    start_time = "",
    end_time = "",
    summary = "暂无",
    organizer_info = { name: "暂无" },
  } = meetingInfo || {};

  if (meetRoomDataStatus === "error") {
    return (
      <View style={[styles.noMeetingInfoContainer, customStyles.container]}>
        <NoMeeting dataStatus="error_meeting" />
      </View>
    );
  }

  if (meetRoomDataStatus === "empty") {
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
        <View style={[styles.infoLabel, customStyles.label]}>
          <MaterialCommunityIcons
            name="clock-time-three-outline"
            size={16}
            color="#999"
          />
          <Text style={[styles.labelText, customStyles.labelText]}>
            会议时间
          </Text>
        </View>
        <Text style={[styles.infoTimeValue, customStyles.timeValue]}>
          {getHourMinute(start_time)} - {getHourMinute(end_time)}
        </Text>
      </View>
      {/* 会议主题行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <Ionicons name="chatbox-ellipses-outline" size={16} color="#999" />
          <Text style={[styles.labelText, customStyles.labelText]}>
            会议主题
          </Text>
        </View>
        <Text style={[styles.infoTitleValue, customStyles.titleValue]}>
          {summary}
        </Text>
      </View>
      {/* 预约人行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <FontAwesome6 name="circle-user" size={14} color="#999" />
          <Text style={[styles.labelText, customStyles.labelText]}>预约人</Text>
        </View>
        <Text style={[styles.infoPersonValue, customStyles.personValue]}>
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
    justifyContent: "center",
    gap: 32,
    padding: 60,
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
    flexDirection: "row",
    alignItems: "center",
    color: "#999",
  },
  labelText: {
    fontSize: 16,
    marginLeft: 4,
    color: "#999",
  },
  infoTimeValue: {
    fontSize: 24,
    color: "#1677ff",
    fontWeight: 700,
  },
  infoTitleValue: {
    fontSize: 30,
    color: "#1d2129",
    fontWeight: 700,
  },
  infoPersonValue: {
    fontSize: 16,
    color: "#4E5969",
  },
  // 新增空数据样式
  emptyText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MeetingInfo;
