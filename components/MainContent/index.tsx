import React from "react";
import { View, StyleSheet } from "react-native";

import MeetingStatus from "@/components/MeetingStatus";
import MeetingInfo from "@/components/MeetingInfo";
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

        <MeetingInfo
          isMeetingActive={isMeetingActive}
          meetingInfo={currentMeeting}
        />
      </View>

      {/* 右侧下一场会议 */}
      <NextMeetingInfo nextMeetings={nextMeetings}></NextMeetingInfo>
    </View>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    flex: 1,
    gap: 10,
  },
  currentMeetingContainer: {
    flex: 5,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
  },
});

export default Index;
