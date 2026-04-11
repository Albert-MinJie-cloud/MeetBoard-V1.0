import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, StyleSheet, Alert } from "react-native";

interface InitFormValues {
  roomId: string;
  appId: string;
  appSecret: string;
}

interface InitModalProps {
  visible: boolean;
  initialValues?: InitFormValues;
  showCancel?: boolean;
  onSave: (values: InitFormValues) => void;
  onClose?: () => void;
}

export default function Index({
  visible,
  initialValues,
  showCancel = false,
  onSave,
  onClose,
}: InitModalProps) {
  const [roomId, setRoomId] = useState("");
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");

  useEffect(() => {
    if (visible) {
      setRoomId(initialValues?.roomId ?? "");
      setAppId(initialValues?.appId ?? "");
      setAppSecret(initialValues?.appSecret ?? "");
    }
  }, [
    initialValues?.appId,
    initialValues?.appSecret,
    initialValues?.roomId,
    visible,
  ]);

  // 保存按钮逻辑
  const handleSave = () => {
    if (!roomId.trim() || !appId.trim() || !appSecret.trim()) {
      Alert.alert("提示", "请完整填写配置信息");
      return;
    }

    onSave({
      roomId: roomId.trim(),
      appId: appId.trim(),
      appSecret: appSecret.trim(),
    });
  };

  // 取消逻辑按钮（只在编辑的时候展示取消逻辑）
  const handleCancel = () => {
    onClose?.();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {showCancel ? "编辑" : "初始化"}会议室配置信息
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="room_id"
              value={roomId}
              onChangeText={setRoomId}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="app_id"
              value={appId}
              onChangeText={setAppId}
            />
            <TextInput
              style={styles.input}
              placeholder="app_secret"
              value={appSecret}
              onChangeText={setAppSecret}
            />
          </View>

          <View style={styles.modalBtnContainer}>
            {showCancel && (
              <Text style={styles.cancelBtn} onPress={handleCancel}>
                取消
              </Text>
            )}
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
    width: 600,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    gap: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  modalBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  cancelBtn: {
    color: "#333",
    backgroundColor: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  saveBtn: {
    color: "#fff",
    backgroundColor: "#1447e6",
    fontWeight: "bold",
    fontSize: 18,
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
