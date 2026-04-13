import React from "react";
import { View, StyleSheet, Text } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Index = () => {
  return (
    <View style={styles.noMeetingContainer}>
      <FontAwesome6
        style={styles.meetingIcon}
        name="clock"
        size={24}
        color="black"
      />
      <Text style={styles.meetingText}>无后续会议</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noMeetingContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
  },
  meetingIcon: {
    color: "#666",
  },
  meetingText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "200",
  },
});

export default Index;
