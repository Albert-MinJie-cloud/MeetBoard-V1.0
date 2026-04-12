import React from "react";
import { View, StyleSheet } from "react-native";

import MeetingStatus from "@/components/MeetingStatus";
import CurrentMeetingInfo from "@/components/CurrentMeetingInfo";
import NextMeetingInfo from "@/components/NextMeetingInfo";

interface IndexProps {
  meetingList: any[];
}

const Index = ({ meetingList }: IndexProps) => {
  const haveEndingMeeting =
    meetingList?.filter((m) => m?.status === "已结束") || [];
  const currentMeeting = meetingList?.find((m) => m?.status === "进行中") || {};
  const nextMeetings = meetingList?.filter((m) => m?.status === "未开始") || [];

  const isMeetingActive = currentMeeting?.status === "进行中";

  return (
    <View style={styles.content}>
      {/* 左侧当前会议 */}
      <View style={styles.currentMeetingContainer}>
        <MeetingStatus isMeetingActive={isMeetingActive} />

        <CurrentMeetingInfo
          isMeetingActive={isMeetingActive}
          meetingInfo={currentMeeting}
        />
      </View>

      {/* 右侧下一场会议 */}
      <View style={styles.nextMeetingContainer}>
        <NextMeetingInfo nextMeetings={nextMeetings}></NextMeetingInfo>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F5F7F9",
    paddingVertical: 40,
    paddingHorizontal: 60,
    gap: 40,
  },
  currentMeetingContainer: {
    flex: 6,
    gap: 32,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 }, // 对应 0 4px
    // shadowOpacity: 0.1, // 对应 10% 透明度
    // shadowRadius: 6, // 对应 6px 模糊
    // // Android 阴影（必须加）
    // elevation: 4,
  },
  nextMeetingContainer: {
    flex: 4,
  },
});

export default Index;
