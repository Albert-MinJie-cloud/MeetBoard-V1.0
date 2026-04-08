import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import {
  getFreeBusyMeetingRoom,
  getMeetingRoomSummary,
} from "@/utils/ApiService";
import { getStorage, STORAGE_KEYS } from "@/utils/StorageService";
import { getMeetingStatus, toFeishuDateTime } from "@/utils/Time";

import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import DebugPanel from "@/components/DebugPanel";

interface IndexProps {
  clearRoomId: () => void;
}

const Index = ({ clearRoomId }: IndexProps) => {
  // 页面数据
  const [meetingList, setMeetingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // console.log(
  //   "MeetingBoard 渲染，当前会议列表:",
  //   loading ? "加载中..." : meetingList,
  // );

  // 定时器Ref（防止内存泄漏）
  const timerRef = useRef<NodeJS.Timeout | null | number>(null);

  // 核心：拉取全量数据（包含条件调用）
  const fetchData = async () => {
    try {
      setLoading(true);

      const startDate = new Date();
      startDate.setHours(0, 0, 0);
      const startTime = toFeishuDateTime(startDate);
      const endDate = new Date();
      endDate.setHours(23, 59, 59);
      const endTime = toFeishuDateTime(endDate);

      // const endTime = "2026-03-18T23:59:59+08:00";
      // const startTime = "2026-03-18T00:00:00+08:00";

      // 1. 查询会议室状态
      const roomRes = await getFreeBusyMeetingRoom(startTime, endTime);

      const roomIds = (await getStorage(STORAGE_KEYS.ROOM_ID)) || "";

      const meetingData = roomRes?.free_busy?.[roomIds] || [];

      const meetingDataWithStatus = meetingData?.map((item: any) => ({
        ...item,
        status: getMeetingStatus(item?.start_time, item?.end_time),
      }));
      // console.log("会议状态数据:", meetingDataWithStatus);

      // 过滤出有效数据
      const validMeetingData = meetingDataWithStatus;
      // ?.filter(
      //   (item) => item?.status === "进行中" || item?.status === "未开始",
      // );

      // 2. 无会议：直接清空数据
      if (validMeetingData?.length === 0) {
        setMeetingList([]);
        setLoading(false);
        return;
      }

      // 3. 有会议：调用第三个接口查询详情
      const uids = validMeetingData?.map((item: any) => item.uid);
      const summaryRes = await getMeetingRoomSummary(uids);
      const eventInfos = summaryRes?.EventInfos || [];

      // 4. 合并两个接口的数据（时间/发起人 + 主题/链接）
      const mergedList = validMeetingData?.map((status: any) => {
        const info = eventInfos?.find((e: any) => e?.uid === status?.uid)!;
        return { ...status, ...info };
      });
      setMeetingList(mergedList);
      // console.log("合并后的会议列表:", mergedList);
    } catch (error) {
      console.error("数据加载失败", error);
    } finally {
      setLoading(false);
    }
  };

  // 每分钟自动刷新
  useEffect(() => {
    // 首次加载
    fetchData();
    // 启动定时器：60秒刷新一次
    timerRef.current = setInterval(fetchData, 60 * 1000);

    // 页面卸载：清理定时器（关键！防止内存泄漏）
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <DebugPanel onClearRoomId={clearRoomId}>
      <View style={styles.meetingBoardContainer}>
        <Header />
        <MainContent meetingList={meetingList} />
      </View>
    </DebugPanel>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  meetingBoardContainer: {
    flex: 1,
    backgroundColor: "#3b70ff",
  },
});

export default Index;
