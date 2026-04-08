import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Index = () => {
  // 状态管理：实时时间（时分）、月日、星期
  const [timeInfo, setTimeInfo] = useState({
    timeHM: "",
    weekDay: "",
    monthDay: "",
  });

  // 格式化获取当前时间：hh:mm、星期、月日
  const getFormattedDateTime = () => {
    const now = new Date();

    // 1. 格式化时分（hh:mm）
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeHM = `${hours}:${minutes}`;

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
    }, 60 * 1000);

    // 组件卸载清除定时器
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.roomText}>当前会议室</Text>
      <View style={styles.timeDateContainer}>
        <Text style={styles.currentTimeText}>{timeInfo.timeHM}</Text>
        <Text style={styles.dateText}>{timeInfo.weekDay}</Text>
        <Text style={styles.dateText}>{timeInfo.monthDay}</Text>
      </View>
    </View>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roomText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  timeDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentTimeText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  dateText: {
    color: "white",
    fontSize: 20,
    marginLeft: 5,
  },
});

export default Index;
