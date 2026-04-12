import React from "react";
import { View, StyleSheet, Text } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface IndexProps {
  dataStatus: "no_meeting" | "error_meeting";
}

const Index = ({ dataStatus }: IndexProps) => {
  const renderText = () => {
    if (dataStatus === "error_meeting") {
      return "会议数据异常";
    }
    return "暂无会议";
  };
  return (
    <View style={styles.noMeetingContainer}>
      <FontAwesome6
        style={styles.meetingIcon}
        name="clock"
        size={24}
        color="black"
      />
      <Text style={styles.meetingText} ellipsizeMode="tail">
        {renderText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noMeetingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
  },
  meetingIcon: {
    color: "#86909c",
  },
  meetingText: {
    fontSize: 20,
    color: "#86909c",
    fontWeight: "200",
  },
});

export default Index;
