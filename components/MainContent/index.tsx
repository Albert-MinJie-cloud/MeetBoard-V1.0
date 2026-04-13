import React from "react";
import { View, StyleSheet } from "react-native";

import MeetingStatus from "@/components/MeetingStatus";
import CurrentMeetingInfo from "@/components/CurrentMeetingInfo";
import NextMeetingInfo from "@/components/NextMeetingInfo";

interface IndexProps {
  meetingList: any[];
}

const Index = ({ meetingList }: IndexProps) => {
  const currentMeeting = meetingList?.find((m) => m?.status === "进行中") || {};
  const nextMeetings = meetingList?.filter((m) => m?.status === "未开始") || [];

  const isMeetingActive = currentMeeting?.status === "进行中";

  return (
    <View style={styles.content}>
      {/* 左侧当前会议 */}
      <View style={styles.currentMeetingContainer}>
        <MeetingStatus isMeetingActive={isMeetingActive} />

        <CurrentMeetingInfo
          meetingInfo={currentMeeting}
          isMeetingActive={isMeetingActive}
        />
      </View>

      {/* 右侧下一场会议 */}
      <View style={styles.nextMeetingContainer}>
        <NextMeetingInfo nextMeetings={nextMeetings} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },

  currentMeetingContainer: {
    flex: 6,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
  },

  nextMeetingContainer: {
    flex: 4,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
  },
});

export default Index;
