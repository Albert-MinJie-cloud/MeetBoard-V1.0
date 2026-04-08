import React, { useState } from "react";
import { View, Text, TextInput, Modal, StyleSheet, Alert } from "react-native";

interface RoomIdModalProps {
  visible: boolean;
  onSave: (roomId: string) => void;
  onClose?: () => void;
}

export default function Index({ visible, onSave, onClose }: RoomIdModalProps) {
  const [inputRoomId, setInputRoomId] = useState("");

  const handleSave = () => {
    if (!inputRoomId.trim()) {
      Alert.alert("提示", "请输入有效的会议室ID");
      return;
    }
    const trimmed = inputRoomId.trim();
    setInputRoomId("");
    onSave(trimmed);
  };

  const handleClose = () => {
    setInputRoomId("");
    onClose?.();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
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
            <Text style={styles.saveBtn} onPress={handleSave}>
              保存
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "60%",
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
});
