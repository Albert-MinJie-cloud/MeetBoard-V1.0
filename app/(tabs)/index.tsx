import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ToastAndroid,
} from "react-native";

import {
  getStorage,
  setStorage,
  removeStorage, // 新增：导入删除存储方法
  STORAGE_KEYS,
} from "@/utils/StorageService";
import {
  getFreeBusyMeetingRoom,
  getMeetingRoomSummary,
} from "@/utils/ApiService";

// 类型定义
interface MeetingItem {
  room_id: string;
  start_time: string; // 格式：YYYY-MM-DD HH:mm:ss
  end_time: string;
  summary?: string; // 会议主题（从summary接口获取）
}

interface MeetingState {
  currentMeeting: MeetingItem | null; // 当前进行中的会议
  nextMeeting: MeetingItem | null; // 下一场会议
  loading: boolean;
}

const MeetingRoomScreen = () => {
  // 弹窗相关状态
  const [modalVisible, setModalVisible] = useState(false);
  const [inputRoomId, setInputRoomId] = useState("");

  // 会议数据相关状态
  const [meetingState, setMeetingState] = useState<MeetingState>({
    currentMeeting: null,
    nextMeeting: null,
    loading: true,
  });

  // 定时器ref（用于清理）
  const refreshTimer = useRef<NodeJS.Timeout | null | number>(null);

  // 格式化时间：YYYY-MM-DD HH:mm:ss（当日0点到当日23:59:59）
  const getTodayTimeRange = () => {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0))
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    const end = new Date(today.setHours(23, 59, 59, 999))
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    return { start, end };
  };

  // 解析会议数据，判断当前/下一场会议
  const parseMeetingData = (
    freeBusyData: any,
    summaryData: any,
    roomId: string,
  ) => {
    if (!freeBusyData || !summaryData)
      return { currentMeeting: null, nextMeeting: null };

    // 筛选当前会议室的会议
    const roomMeetings = freeBusyData.busy_info?.[roomId] || [];
    const now = new Date();

    // 给会议补充主题
    const meetingsWithSummary: MeetingItem[] = roomMeetings.map(
      (item: any) => ({
        room_id: roomId,
        start_time: item.start_time,
        end_time: item.end_time,
        summary:
          summaryData.summary_info?.[roomId]?.[item.start_time] || "无主题会议",
      }),
    );

    // 排序：按开始时间升序
    meetingsWithSummary.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

    // 查找当前进行中的会议（now在start和end之间）
    const currentMeeting = meetingsWithSummary.find(
      (item) =>
        new Date(item.start_time) <= now && new Date(item.end_time) >= now,
    );

    // 查找下一场未开始的会议（start > now）
    const nextMeeting = meetingsWithSummary.find(
      (item) => new Date(item.start_time) > now,
    );

    return { currentMeeting, nextMeeting };
  };

  // 拉取会议数据
  const fetchMeetingData = async () => {
    try {
      setMeetingState((prev) => ({ ...prev, loading: true }));
      const roomId = await getStorage(STORAGE_KEYS.ROOM_ID);
      if (!roomId) return;

      const { start, end } = getTodayTimeRange();
      // 并行请求两个接口
      const [freeBusyData, summaryData] = await Promise.all([
        getFreeBusyMeetingRoom([roomId], start, end),
        getMeetingRoomSummary(),
      ]);

      // 解析数据，更新状态
      const { currentMeeting, nextMeeting } = parseMeetingData(
        freeBusyData,
        summaryData,
        roomId,
      );
      setMeetingState({
        currentMeeting,
        nextMeeting,
        loading: false,
      });
    } catch (e) {
      setMeetingState((prev) => ({ ...prev, loading: false }));
      Alert.alert("数据加载失败", (e as Error).message);
      console.error("fetchMeetingData error:", e);
    }
  };

  // 初始化：检查roomId
  useEffect(() => {
    const init = async () => {
      const roomId = await getStorage(STORAGE_KEYS.ROOM_ID);
      if (roomId) {
        // 有roomId，直接拉取数据
        await fetchMeetingData();
        // 启动每分钟刷新
        refreshTimer.current = setInterval(fetchMeetingData, 60 * 1000);
      } else {
        // 无roomId，显示弹窗
        setModalVisible(true);
        setMeetingState((prev) => ({ ...prev, loading: false }));
      }
    };

    init();

    // 清理定时器（组件卸载时）
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, []);

  // 保存roomId
  const handleSaveRoomId = async () => {
    if (!inputRoomId.trim()) {
      Alert.alert("提示", "请输入有效的会议室ID");
      return;
    }
    await setStorage(STORAGE_KEYS.ROOM_ID, inputRoomId.trim());
    setModalVisible(false);
    // 清空输入框
    setInputRoomId("");
    // 拉取数据并启动刷新
    await fetchMeetingData();
    // 先清理旧定时器，避免重复
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(fetchMeetingData, 60 * 1000);
  };

  // 新增：重置RoomID的核心方法
  const handleResetRoomId = async () => {
    // 二次确认，防止误触
    Alert.alert("确认重置", "是否要更换会议室ID？重置后将重新输入新的ID", [
      { text: "取消", style: "cancel" },
      {
        text: "确认",
        onPress: async () => {
          // 1. 清理定时器
          if (refreshTimer.current) {
            clearInterval(refreshTimer.current);
            refreshTimer.current = null;
          }
          // 2. 删除本地存储的RoomID和Token（避免残留）
          await Promise.all([
            removeStorage(STORAGE_KEYS.ROOM_ID),
            removeStorage(STORAGE_KEYS.TENANT_TOKEN),
            removeStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME),
          ]);
          // 3. 清空会议数据
          setMeetingState({
            currentMeeting: null,
            nextMeeting: null,
            loading: false,
          });
          // 4. 弹出输入新RoomID的弹窗
          setModalVisible(true);
          // 5. 安卓原生提示（更友好）
          ToastAndroid.show("已重置会议室ID，请输入新ID", ToastAndroid.SHORT);
        },
      },
    ]);
  };

  // 加载中展示
  if (meetingState.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 输入roomId的弹窗 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>请输入会议室ID</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：room123456"
              value={inputRoomId}
              onChangeText={setInputRoomId}
              autoFocus
            />
            <View style={styles.modalBtnContainer}>
              <Text style={styles.saveBtn} onPress={handleSaveRoomId}>
                保存
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* 会议信息展示 */}
      <View style={styles.meetingCard}>
        {/* 新增：长按标题触发重置RoomID（隐藏按钮核心） */}
        <TouchableWithoutFeedback
          onLongPress={handleResetRoomId} // 长按触发重置
          onPress={() => {
            // 可选：短按提示（比如连续点击3次触发，增强隐藏性）
            // 这里仅做长按，若要更隐藏可改为：连续点击5次标题触发
          }}
        >
          <Text style={styles.cardTitle}>会议室状态</Text>
        </TouchableWithoutFeedback>

        {/* 当前会议 */}
        <View style={styles.meetingSection}>
          <Text style={styles.sectionTitle}>当前会议</Text>
          {meetingState.currentMeeting ? (
            <View style={styles.meetingItem}>
              <Text style={styles.meetingSummary}>
                主题：{meetingState.currentMeeting.summary}
              </Text>
              <Text style={styles.meetingTime}>
                时间：{meetingState.currentMeeting.start_time} -{" "}
                {meetingState.currentMeeting.end_time}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>暂无进行中的会议</Text>
          )}
        </View>

        {/* 下一场会议 */}
        <View style={styles.meetingSection}>
          <Text style={styles.sectionTitle}>下一场会议</Text>
          {meetingState.nextMeeting ? (
            <View style={styles.meetingItem}>
              <Text style={styles.meetingSummary}>
                主题：{meetingState.nextMeeting.summary}
              </Text>
              <Text style={styles.meetingTime}>
                时间：{meetingState.nextMeeting.start_time} -{" "}
                {meetingState.nextMeeting.end_time}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>暂无后续会议</Text>
          )}
        </View>

        {/* 可选：超隐蔽的重置按钮（比如放在页面角落，文字透明） */}
        <TouchableWithoutFeedback onPress={handleResetRoomId}>
          <Text style={styles.hiddenResetBtn}>更换会议室</Text>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalBtnContainer: {
    alignItems: "center",
  },
  saveBtn: {
    fontSize: 18,
    color: "#0066CC",
    fontWeight: "bold",
  },
  meetingCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  meetingSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  meetingItem: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 15,
  },
  meetingSummary: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  meetingTime: {
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    padding: 10,
  },
  // 新增：隐藏重置按钮样式（透明文字，放在角落）
  hiddenResetBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 12,
    color: "transparent", // 文字透明，肉眼不可见
    backgroundColor: "transparent",
    padding: 10, // 扩大点击区域，方便操作
  },
});

export default MeetingRoomScreen;
