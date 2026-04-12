import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getHourMinute } from "@/utils/Time";

/**
 * 会议信息展示组件
 * @param {Object} props - 组件属性
 * @param {Object} props.nextMeetings - 会议信息对象（必须包含time/theme/booker字段）
 */

interface NextMeetingInfoProps {
  nextMeetings: {
    summary: string;
    start_time: string;
    end_time: string;
    organizer_info: {
      name: string;
    };
  }[];
}

const NextMeetingInfo = ({ nextMeetings }: NextMeetingInfoProps) => {
  return (
    <View style={styles.nextMeetingsContainer}>
      <Text style={styles.nextMeetingTitle}>下一场会议</Text>

      <FlatList
        data={nextMeetings}
        keyExtractor={(item, index) => index.toString()}
        style={styles.meetingScrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({ item }) => (
          <View style={styles.meetingItem}>
            <Text
              style={styles.meetingTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.summary}
            </Text>
            <Text
              style={styles.meetingTimePerson}
            >{`${getHourMinute(item?.start_time)} - ${getHourMinute(item?.end_time)} | ${item?.organizer_info?.name}`}</Text>
          </View>
        )}
        // 可选：添加列表空数据提示
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>暂无后续会议</Text>
        )}
      />
    </View>
  );
};

// 原有样式迁移（保留原命名，确保样式一致性）
const styles = StyleSheet.create({
  nextMeetingsContainer: {
    padding: 10,
  },
  nextMeetingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  meetingScrollView: {
    flex: 1, // 撑满剩余空间
    marginTop: 5, // 和标题保持间距
  },
  meetingItem: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    marginBottom: 10,
  },
  meetingTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  meetingTimePerson: {
    fontSize: 14,
    color: "#666",
  },
  // 新增空数据样式
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default NextMeetingInfo;
