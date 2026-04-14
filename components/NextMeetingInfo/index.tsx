import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getHourMinute } from "@/utils/Time";

import NoMeeting from "@/components/NoMeeting";

import {
  useFonts,
  NotoSansSC_700Bold,
  NotoSansSC_900Black,
} from "@expo-google-fonts/noto-sans-sc";

/**
 * 会议信息展示组件
 * @param {Object} props - 组件属性
 * @param {Object} props.nextMeetings - 会议信息对象（必须包含time/theme/booker字段）
 */

interface NextMeetingInfoProps {
  nextMeetings: {
    uid: string;
    summary: string;
    start_time: string;
    end_time: string;
    organizer_info: {
      name: string;
    };
  }[];
}

const NextMeetingInfo = ({ nextMeetings }: NextMeetingInfoProps) => {
  const [fontsLoaded] = useFonts({
    NotoSansSC_700Bold,
    NotoSansSC_900Black,
  });

  console.log("字体加载是否成功", fontsLoaded);

  return (
    <View style={styles.nextMeetingsContainer}>
      <View style={styles.nextMeetingTitleContainer}>
        <View style={styles.nextMeetingTitleIcon} />
        <Text style={styles.nextMeetingTitle}>后续会议</Text>
      </View>

      <FlatList
        data={nextMeetings}
        keyExtractor={(item) => item?.uid?.toString()}
        style={styles.meetingScrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({ item, index }) => (
          <View style={styles.meetingItem}>
            <Text
              style={styles.meetingTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.summary}
            </Text>

            <Text style={styles.meetingPerson}>
              {`${getHourMinute(item?.start_time)} - ${getHourMinute(item?.end_time)} | ${item?.organizer_info?.name}`}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => <NoMeeting />}
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
    marginBottom: 16,
    height: 40,
  },
  nextMeetingTitleIcon: {
    width: 6,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#1677ff",
    marginRight: 10,
    marginTop: 4,
  },
  nextMeetingTitle: {
    fontSize: 28,
    fontFamily: "NotoSansSC_700Bold",
    lineHeight: 40,
    color: "#000",
  },
  meetingScrollView: {
    flex: 1,
    paddingRight: 4,
  },
  meetingItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    gap: 4,
    padding: 16,
    marginBottom: 16,
  },
  meetingTitle: {
    fontSize: 22,
    color: "#666",
    lineHeight: 24,
    fontFamily: "NotoSansSC_900Black",
  },
  meetingPerson: {
    fontSize: 20,
    color: "#666",
  },
});

export default NextMeetingInfo;
