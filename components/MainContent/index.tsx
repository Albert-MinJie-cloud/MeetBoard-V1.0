import React from "react";
import { View, StyleSheet } from "react-native";

import MeetingStatus from "@/components/MeetingStatus";
import CurrentMeetingInfo from "@/components/CurrentMeetingInfo";
import NextMeetingInfo from "@/components/NextMeetingInfo";

interface IndexProps {
  meetingList: any[];
  meetRoomDataStatus: "empty" | "error" | "haveMeeting";
}

const Index = ({ meetingList, meetRoomDataStatus }: IndexProps) => {
  const currentMeeting = meetingList?.find((m) => m?.status === "进行中") || {};
  const nextMeetings = meetingList?.filter((m) => m?.status === "未开始") || [];

  const isMeetingActive = currentMeeting?.status === "进行中";

  return (
    <View style={styles.content}>
      {/* 左侧当前会议 */}
      <View style={styles.currentMeetingContainer}>
        <MeetingStatus
          isMeetingActive={isMeetingActive}
          meetRoomDataStatus={meetRoomDataStatus}
        />

        <CurrentMeetingInfo
          meetingInfo={currentMeeting}
          isMeetingActive={isMeetingActive}
          meetRoomDataStatus={meetRoomDataStatus}
        />
      </View>

      {/* 右侧下一场会议 */}
      <View style={styles.nextMeetingContainer}>
        <NextMeetingInfo
          nextMeetings={nextMeetings}
          meetRoomDataStatus={meetRoomDataStatus}
        />
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
  },
  nextMeetingContainer: {
    flex: 4,
  },
});

export default Index;
