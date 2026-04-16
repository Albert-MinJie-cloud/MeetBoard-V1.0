import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
    labelBoldValue?: object;
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
      return "  ";
    }
    return `${getHourMinute(start_time)} - ${getHourMinute(end_time)}`;
  };

  const renderSummary = () => {
    if (!isMeetingActive) {
      return "  ";
    }
    return summary;
  };

  const renderPerson = () => {
    if (!isMeetingActive) {
      return "  ";
    }
    return organizer_info?.name;
  };

  return (
    <View style={[styles.meetingInfoContainer, customStyles.container]}>
      {/* 会议时间行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <View style={styles.icon}>
            <Ionicons name="time-outline" size={24} color="#666" />
          </View>
          <Text style={[styles.labelText, customStyles.labelText]}>时间</Text>
        </View>
        <Text style={[styles.labelValue, customStyles.labelValue]}>
          {renderTime()}
        </Text>
      </View>
      {/* 会议主题行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <View style={styles.icon}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="#666" />
          </View>
          <Text style={[styles.labelText, customStyles.labelText]}>主题</Text>
        </View>
        <Text
          style={[styles.labelBoldValue, customStyles.labelBoldValue]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {renderSummary()}
        </Text>
      </View>
      {/* 预约人行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <View style={styles.icon}>
            <Ionicons name="person-outline" size={24} color="#666" />
          </View>
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
    paddingHorizontal: 12,
  },
  infoRow: {
    flexDirection: "column", // 标签和值上下排列
    justifyContent: "flex-start",
  },
  infoLabel: {
    height: 32,
    flexDirection: "row",
    alignItems: "center", // 核心：垂直居中
    justifyContent: "flex-start",
  },
  icon: {
    paddingTop: 3,
  },
  labelText: {
    fontSize: 28,
    lineHeight: 32,
    color: "#666",
    fontFamily: "Source_Han_Sans_SC_Regular",
    marginStart: 4,
  },
  labelValue: {
    marginTop: 4,
    fontSize: 28,
    lineHeight: 32,
    color: "#000",
    fontFamily: "Source_Han_Sans_SC_Regular",
    marginStart: 30,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  labelBoldValue: {
    marginTop: 4,
    fontSize: 28,
    lineHeight: 32,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "Source_Han_Sans_SC_Bold",
    marginStart: 30,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default MeetingInfo;
