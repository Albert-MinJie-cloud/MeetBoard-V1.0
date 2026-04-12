import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getHourMinute } from "@/utils/Time";

import NoMeeting from "@/components/NoMeeting";

/**
 * 会议信息展示组件
 * @param {Object} props - 组件属性
 * @param {Object} props.nextMeetings - 会议信息对象（必须包含time/theme/booker字段）
 */

interface NextMeetingInfoProps {
  nextMeetings: {
    summary: string;
    start_time: string;
    end_time: string;
    organizer_info: {
      name: string;
    };
  }[];
}

const NextMeetingInfo = ({ nextMeetings }: NextMeetingInfoProps) => {
  return (
    <View style={styles.nextMeetingsContainer}>
      <View style={styles.nextMeetingTitleContainer}>
        <View style={styles.nextMeetingTitleIcon} />
        <Text style={styles.nextMeetingTitle}>下一场会议</Text>
      </View>

      <FlatList
        data={nextMeetings}
        keyExtractor={(item, index) => index.toString()}
        style={styles.meetingScrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({ item, index }) => (
          <View style={styles.meetingItem}>
            <Text
              style={styles.meetingTime}
            >{`${getHourMinute(item?.start_time)} - ${getHourMinute(item?.end_time)}`}</Text>
            <Text
              style={styles.meetingTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.summary}
            </Text>
            <Text
              style={styles.meetingPerson}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.organizer_info?.name}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.meetingItem}>
            <NoMeeting dataStatus="no_meeting" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nextMeetingsContainer: {
    flex: 1,
  },
  nextMeetingTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  nextMeetingTitleIcon: {
    width: 6,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#1677ff",
    marginRight: 10,
  },
  nextMeetingTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4E5969",
  },
  meetingScrollView: {
    flex: 1,
    paddingRight: 4,
  },
  meetingItem: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#fff",
    gap: 20,
    padding: 32,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // 对应 0 4px
    shadowOpacity: 0.1, // 对应 10% 透明度
    shadowRadius: 6, // 对应 6px 模糊
    elevation: 4,
  },
  meetingTime: {
    fontSize: 24,
    color: "#1677ff",
  },
  meetingTitle: {
    fontSize: 28,
    color: "#1d2129",
    fontWeight: "600",
  },
  meetingPerson: {
    fontSize: 20,
    color: "#86909c",
    fontWeight: "200",
  },
});

export default NextMeetingInfo;
