import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState, useRef } from "react";

interface Props {
  onClearRoomId: () => void;
  children: React.ReactNode; // 包裹页面内容
}

export default function DebugPanel({ onClearRoomId, children }: Props) {
  // 🔥 用 ref 存点击计数（无冗余，不触发重渲染）
  const tapCountRef = useRef(0);
  const [showDebug, setShowDebug] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null | number>(null);

  // 配置
  const TRIGGER_TAP = 7;
  const AUTO_HIDE_MS = 30 * 1000;

  // 重置自动隐藏计时器
  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowDebug(false);
      tapCountRef.current = 0;
    }, AUTO_HIDE_MS);
  };

  // 全局点击计数（RN 原生方案）
  const handleGlobalTap = () => {
    if (showDebug) return;
    tapCountRef.current += 1;
    // 满7次显示
    if (tapCountRef.current >= TRIGGER_TAP) {
      setShowDebug(true);
      resetHideTimer();
      tapCountRef.current = 0;
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // 点击调试按钮
  const handleDebugPress = () => {
    onClearRoomId();
    resetHideTimer(); // 续30秒
  };

  return (
    <TouchableWithoutFeedback onPress={handleGlobalTap} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* 页面内容 */}
        {children}

        {/* 调试悬浮按钮 */}
        {showDebug && (
          <TouchableOpacity
            style={styles.debugBtn}
            onPress={handleDebugPress}
            activeOpacity={0.7}
          >
            <Text style={styles.text}>清空会议室ID</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  debugBtn: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: "#FFF",
    fontSize: 12,
  },
});
