import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { getHourMinute } from "@/utils/Time";

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
    timeValue?: object;
    titleValue?: object;
    personValue?: object;
    labelText?: object;
    labelValue?: object;
  };
}

const MeetingInfo = ({
  meetingInfo,
  isMeetingActive,
  customStyles = {},
}: MeetingInfoProps) => {
  // 解构会议信息，添加默认值避免空值报错

  const {
    start_time = "",
    end_time = "",
    summary = "暂无",
    organizer_info = { name: "暂无" },
  } = meetingInfo || {};

  const renderTime = () => {
    if (!isMeetingActive) {
      return "暂无";
    }
    return `${getHourMinute(start_time)} - ${getHourMinute(end_time)}`;
  };

  const renderSummary = () => {
    if (!isMeetingActive) {
      return "暂无";
    }
    return summary;
  };

  const renderPerson = () => {
    if (!isMeetingActive) {
      return "暂无";
    }
    return organizer_info?.name;
  };

  return (
    <View style={[styles.meetingInfoContainer, customStyles.container]}>
      {/* 会议时间行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <MaterialCommunityIcons
            name="clock-time-three-outline"
            size={20}
            color="#000"
          />
          <Text style={[styles.labelText, customStyles.labelText]}>
            会议时间
          </Text>
        </View>
        <Text style={[styles.labelValue, customStyles.labelValue]}>
          {renderTime()}
        </Text>
      </View>
      {/* 会议主题行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#000" />
          <Text style={[styles.labelText, customStyles.labelText]}>
            会议主题
          </Text>
        </View>
        <Text
          style={[styles.labelValue, customStyles.labelValue]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {renderSummary()}
        </Text>
      </View>
      {/* 预约人行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <FontAwesome6 name="circle-user" size={18} color="#000" />
          <Text style={[styles.labelText, customStyles.labelText]}>预约人</Text>
        </View>
        <Text style={[styles.labelValue, customStyles.labelValue]}>
          {renderPerson()}
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
    paddingLeft: 12,
  },
  infoRow: {
    flexDirection: "column", // 标签和值上下排列
    justifyContent: "flex-start",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    fontSize: 24,
    marginLeft: 4,
    color: "#000",
    fontWeight: "600",
  },
  labelValue: {
    marginStart: 22,
    fontSize: 28,
    marginLeft: 4,
    color: "#666",
  },
});

export default MeetingInfo;
