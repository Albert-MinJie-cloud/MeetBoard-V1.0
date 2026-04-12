import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

const Index = () => {
  // 状态管理：实时时间（时分）、月日、星期
  const [timeInfo, setTimeInfo] = useState({
    timeHM: "",
    weekDay: "",
    monthDay: "",
    timeHMS: "",
  });

  // 格式化获取当前时间：hh:mm、星期、月日
  const getFormattedDateTime = () => {
    const now = new Date();

    // 1. 格式化时分（hh:mm）
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeHM = `${hours}:${minutes}`;
    const timeHMS = `${hours}:${minutes}:${seconds}`;

    // 2. 格式化星期（中文）
    const weekDays = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    const weekDay = weekDays[now.getDay()];

    // 3. 格式化月日（MM月DD日）
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需+1
    const day = String(now.getDate()).padStart(2, "0");
    const monthDay = `${month}月${day}日`;

    return {
      timeHMS, // 时分秒：如 10:30:45
      timeHM, // 时分：如 10:30
      weekDay, // 星期：如 星期四
      monthDay, // 月日：如 04月03日
      fullDate: `${monthDay} ${weekDay}`, // 组合：如 04月03日 星期四
    };
  };

  // 定时更新时间（每分钟更新一次，兼顾性能）
  useEffect(() => {
    // 初始化更新
    setTimeInfo(getFormattedDateTime());
    // 每分钟刷新一次
    const timer = setInterval(() => {
      setTimeInfo(getFormattedDateTime());
    }, 30);

    // 组件卸载清除定时器
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.fontIconContainer}>
        <FontAwesome6
          style={styles.fontIcon}
          name="location-dot"
          size={32}
          color="rgb(190, 219, 255)"
        />
        <Text style={styles.roomText}>当前会议室</Text>
      </View>

      <View style={styles.timeDateContainer}>
        <View style={styles.dateContainer}>
          <FontAwesome5
            name="calendar-alt"
            style={styles.dataIcon}
            size={24}
            color="rgb(190, 219, 255)"
          />
          <Text style={styles.dateText}>{timeInfo.monthDay}</Text>
          <Text style={styles.dateText}>{timeInfo.weekDay}</Text>
        </View>

        <Text style={styles.currentTimeText}>{timeInfo.timeHM}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 120,
    paddingHorizontal: 60,
    backgroundColor: "#1447e6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    // shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fontIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontIcon: {
    opacity: 0.8,
    marginRight: 12,
  },
  roomText: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  timeDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentTimeText: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  dataIcon: {
    opacity: 0.8,
    marginRight: 6,
  },
  dateContainer: {
    marginRight: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: "rgba(25, 60, 184, 0.5)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateText: {
    fontSize: 24,
    color: "white",
  },
});

export default Index;
