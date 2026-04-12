import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

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
      Toast.show({
        type: "info",
        text1: "提示",
        text2: "请先完成初始化配置信息",
      });
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
            {showCancel ? "编辑" : "初始化"}会议室配置
          </Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>会议室ID</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入 room_id"
                value={roomId}
                onChangeText={setRoomId}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>应用ID</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入 app_id"
                value={appId}
                onChangeText={setAppId}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>应用密钥</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入 app_secret"
                value={appSecret}
                onChangeText={setAppSecret}
              />
            </View>
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
    backgroundColor: "rgba(250,250,250,0.85)",
    borderRadius: 24,
    padding: 24,
    paddingHorizontal: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    gap: 24,
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    width: 80,
    fontSize: 14,
    marginRight: 8,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  modalBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  cancelBtn: {
    color: "#333",
    backgroundColor: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  saveBtn: {
    color: "#fff",
    backgroundColor: "#1677ff",
    fontWeight: "bold",
    fontSize: 14,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
});
