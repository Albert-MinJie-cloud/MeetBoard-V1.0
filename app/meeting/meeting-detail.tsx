import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useRef } from "react";
import { clearRoomInfo } from "../../utils/StorageService";
import { useRouter } from "expo-router";
import CustomModal from "../../components/Modal";

/**
 * 会议详情页面
 * 包含隐藏的调试功能，通过连续点击右下角区域7次可激活清除房间信息的按钮
 */
export default function Index() {
  const router = useRouter();
  // 记录右下角区域的点击次数
  const [tapCount, setTapCount] = useState(0);
  // 控制调试按钮的显示状态
  const [showDebugButton, setShowDebugButton] = useState(false);
  // 控制确认对话框的显示状态
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // 用于重置点击计数的定时器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 处理调试区域的点击事件
   * 连续点击7次可激活调试按钮，3秒内未达到7次则重置计数
   */
  const handleDebugAreaTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (newCount >= 7) {
      // 达到7次点击，显示调试按钮
      setShowDebugButton(true);
      setTapCount(0);
      timerRef.current = null;
    } else {
      // 3秒后重置计数
      timerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 3000);
    }
  };

  /**
   * 点击清除房间信息按钮，显示确认对话框
   */
  const handleClearRoomInfo = () => {
    setShowConfirmModal(true);
  };

  /**
   * 确认清除房间信息
   * 清除后隐藏调试按钮和对话框，并返回首页
   */
  const handleConfirmClear = async () => {
    await clearRoomInfo();
    setShowConfirmModal(false);
    setShowDebugButton(false);
    router.replace("/");
  };

  /**
   * 取消清除操作，关闭确认对话框
   */
  const handleCancelClear = () => {
    setShowConfirmModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>meeting-detail</Text>

      {/* 调试按钮：清除房间信息 */}
      {showDebugButton && (
        <TouchableOpacity
          style={styles.debugButton}
          onPress={handleClearRoomInfo}
        >
          <Text style={styles.buttonText}>清除房间信息</Text>
        </TouchableOpacity>
      )}

      {/* 右下角调试触发区域 */}
      <TouchableOpacity
        style={styles.debugTrigger}
        onPress={handleDebugAreaTap}
        activeOpacity={1}
      />

      {/* 确认清除对话框 */}
      <CustomModal
        visible={showConfirmModal}
        title="确认清除"
        message="确定要清除房间信息吗？"
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
    </View>
  );
}

// 样式定义
const styles = StyleSheet.create({
  // 主容器：垂直居中布局
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  // 页面标题
  title: {
    fontSize: 24,
  },
  // 调试按钮：固定在右下角
  debugButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  // 按钮文字样式
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  // 调试触发区域：右下角100x100透明区域
  debugTrigger: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    backgroundColor: "transparent",
  },
});
