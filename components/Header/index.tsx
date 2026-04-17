import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface IndexProps {
  meetRoomName: string;
}

const Index = ({ meetRoomName }: IndexProps) => {
  // 状态管理：实时时间（时分）、月日、星期
  const [timeInfo, setTimeInfo] = useState({
    timeHM: "",
    weekDay: "",
    monthDay: "",
    timeHMS: "",
    yearsDay: "",
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

    const years = String(now.getFullYear()).padStart(4, "0");
    const yearsDay = `${years}年`;

    return {
      timeHMS, // 时分秒：如 10:30:45
      timeHM, // 时分：如 10:30
      weekDay, // 星期：如 星期四
      monthDay, // 月日：如 04月03日
      yearsDay,
      fullDate: `${monthDay} ${weekDay}`, // 组合：如 04月03日 星期四
    };
  };

  // 定时更新时间（1秒更新一次，兼顾性能）
  useEffect(() => {
    // 初始化更新
    setTimeInfo(getFormattedDateTime());
    const timer = setInterval(() => {
      setTimeInfo(getFormattedDateTime());
    }, 1000);

    // 组件卸载清除定时器
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.roomText}>
        {meetRoomName ? meetRoomName : "当前会议室"}
      </Text>

      <Text style={styles.currentTimeText}>{timeInfo.timeHM}</Text>

      <View style={styles.dateContainer}>
        <FontAwesome5
          name="calendar-alt"
          style={styles.dataIcon}
          size={20}
          color="rgb(190, 219, 255)"
        />
        <Text style={styles.dateText}>{timeInfo.yearsDay}</Text>
        <Text style={styles.dateText}>{timeInfo.monthDay}</Text>
        <Text style={styles.dateText}>{timeInfo.weekDay}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomText: {
    fontSize: 32,
    color: "white",
    lineHeight: 36,
    fontFamily: "Source_Han_Sans_SC_Regular",
  },

  currentTimeText: {
    fontSize: 32,
    color: "white",
    lineHeight: 36,
    fontWeight: "bold",
    fontFamily: "Source_Han_Sans_SC_Bold",
  },
  dateContainer: {
    paddingTop: 4,
    paddingBottom: 6,
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 30,
    backgroundColor: "rgba(25, 60, 184, 0.5)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dataIcon: {
    opacity: 0.8,
    marginTop: 2,
    marginRight: 6,
  },
  dateText: {
    fontSize: 20,
    color: "white",
    lineHeight: 24,
    fontFamily: "Source_Han_Sans_SC_Regular",
  },
});

export default Index;
