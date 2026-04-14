import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { getHourMinute } from "@/utils/Time";

import { useFonts, NotoSansSC_900Black } from "@expo-google-fonts/noto-sans-sc";

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

  const [fontsLoaded] = useFonts({
    NotoSansSC_900Black,
  });

  console.log("字体加载是否成功", fontsLoaded);

  return (
    <View style={[styles.meetingInfoContainer, customStyles.container]}>
      {/* 会议时间行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <MaterialCommunityIcons
            name="clock-time-three-outline"
            size={28}
            color="#666"
          />
          <Text style={[styles.labelText, customStyles.labelText]}>时间</Text>
        </View>
        <Text style={[styles.labelValue, customStyles.labelValue]}>
          {renderTime()}
        </Text>
      </View>
      {/* 会议主题行 */}
      <View style={[styles.infoRow, customStyles.row]}>
        <View style={[styles.infoLabel, customStyles.label]}>
          <Ionicons name="chatbox-ellipses-outline" size={28} color="#666" />
          <Text style={[styles.labelText, customStyles.labelText]}>主题</Text>
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
          <FontAwesome5 name="user-circle" size={28} color="#666" />
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
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: "#666",
  },
  labelText: {
    fontSize: 32,
    color: "#666",
    lineHeight: 40,
    fontFamily: "NotoSansSC_900Black",
    marginStart: 4,
  },
  labelValue: {
    fontSize: 32,
    color: "#000",
    lineHeight: 40,
    fontFamily: "NotoSansSC_900Black",
    marginStart: 32,
  },
});

export default MeetingInfo;
