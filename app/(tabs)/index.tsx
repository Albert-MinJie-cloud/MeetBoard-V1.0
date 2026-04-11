import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import {
  getStorage,
  setStorage,
  removeStorage,
  STORAGE_KEYS,
} from "@/utils/StorageService";

import InitModal from "@/components/InitModal";
import MeetingBoard from "@/components/MeetingBoard";

interface InitFormValues {
  roomId: string;
  appId: string;
  appSecret: string;
}

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  const [formValues, setFormValues] = useState<InitFormValues>({
    roomId: "",
    appId: "",
    appSecret: "",
  });

  useEffect(() => {
    const init = async () => {
      const roomId = await getStorage(STORAGE_KEYS.ROOM_ID);
      const appId = await getStorage(STORAGE_KEYS.APP_ID);
      const appSecret = await getStorage(STORAGE_KEYS.APP_SECRET);

      setFormValues({
        roomId: roomId ?? "",
        appId: appId ?? "",
        appSecret: appSecret ?? "",
      });

      if (roomId && appId && appSecret) {
        setShowDetails(true);
      } else {
        setIsEditingConfig(false);
        setModalVisible(true);
      }
    };

    init();
  }, []);

  // 保存信息
  const handleSaveConfig = async (values: InitFormValues) => {
    await setStorage(STORAGE_KEYS.ROOM_ID, values.roomId);
    await setStorage(STORAGE_KEYS.APP_ID, values.appId);
    await setStorage(STORAGE_KEYS.APP_SECRET, values.appSecret);

    await removeStorage(STORAGE_KEYS.TENANT_TOKEN);
    await removeStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME);

    setFormValues(values);
    setIsEditingConfig(false);
    setModalVisible(false);
    setShowDetails(true);
  };

  // 编辑信息
  const handleEditConfig = () => {
    setIsEditingConfig(true);
    setModalVisible(true);
    setShowDetails(false);
  };

  // 取消编辑信息
  const handleCancelEdit = () => {
    setIsEditingConfig(false);
    setModalVisible(false);
    setShowDetails(true);
  };

  if (showDetails) {
    return (
      <View style={styles.container}>
        <MeetingBoard onEditConfig={handleEditConfig} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InitModal
        visible={modalVisible}
        initialValues={formValues}
        onSave={handleSaveConfig}
        onClose={handleCancelEdit}
        showCancel={isEditingConfig}
      />
    </View>
  );
};

// 样式适配1920*1080横屏（安卓11）
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1447e6",
    padding: 20,
  },
});

export default Index;
