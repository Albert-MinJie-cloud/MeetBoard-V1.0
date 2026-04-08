import React from "react";
import { View, StyleSheet } from "react-native";

import MeetingStatus from "@/components/MeetingStatus";
import MeetingInfo from "@/components/MeetingInfo";
import NextMeetingInfo from "@/components/NextMeetingInfo";

interface IndexProps {
  meetingList: any[];
}

const Index = ({ meetingList }: IndexProps) => {
  // // 会议数据
  // const currentMeeting = {
  //   time: "10:00—12:00",
  //   theme: "北京分公司2026年第一季度经营分析会 第一次会议",
  //   booker: "王阳1",
  // };

  // const nextMeetings = [
  //   {
  //     title:
  //       "研发部软件新增功能讲解研发部软件新增功能讲解研发部软件新增功能讲解研发部软件新增功能讲解",
  //     time: "10:50-12:30",
  //     person: "美成稗",
  //   },
  //   { title: "销售部用业绩汇报会议", time: "11:40-12:40", person: "周城员" },
  //   { title: "技术部产品破件均训会议", time: "14:00-15:30", person: "王垾" },
  //   { title: "人事部新人培训会", time: "10:50-12:30", person: "隋长风" },
  // ];

  const haveEndingMeeting =
    meetingList?.filter((m) => m?.status === "已结束") || [];
  const currentMeeting = meetingList?.find((m) => m?.status === "进行中") || {};
  const nextMeetings = meetingList?.filter((m) => m?.status === "未开始") || [];

  // console.log("当前会议:", currentMeeting);
  // console.log("下一场会议:", nextMeetings);
  // console.log("已结束的会议:", haveEndingMeeting);

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
