import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";

interface Props {
  onEditConfig?: () => void;
  children: React.ReactNode;
}

export default function DebugPanel({ onEditConfig, children }: Props) {
  const [showDebug, setShowDebug] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null | number>(null);

  // 四角点击序列
  const cornerSequenceRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const TAP_TIMEOUT = 5000;
  const CORNER_SIZE = 80;
  const { width, height } = Dimensions.get("window");

  // 重置计时器
  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowDebug(false);
      cornerSequenceRef.current = 0;
    }, 30 * 1000);
  };

  // 重置序列
  const resetCornerSequence = () => {
    cornerSequenceRef.current = 0;
    lastTapTimeRef.current = 0;
  };

  // 判断点击哪个角落
  const getCornerIndex = (x: number, y: number) => {
    if (x < CORNER_SIZE && y < CORNER_SIZE) return 0; // 左上
    if (x > width - CORNER_SIZE && y < CORNER_SIZE) return 1; // 右上
    if (x > width - CORNER_SIZE && y > height - CORNER_SIZE) return 2; // 右下
    if (x < CORNER_SIZE && y > height - CORNER_SIZE) return 3; // 左下
    return null;
  };

  // 核心：触摸监听（不会被任何子元素拦截）
  const handleTouch = (e: any) => {
    console.log("handleTouch", e);
    if (showDebug) return;

    const { pageX, pageY } = e.nativeEvent; // ✅ 唯一稳定坐标
    const corner = getCornerIndex(pageX, pageY);
    const now = Date.now();

    // 点击不在角落 → 重置
    if (corner === null) {
      resetCornerSequence();
      return;
    }

    // 超时 → 重置
    if (lastTapTimeRef.current && now - lastTapTimeRef.current > TAP_TIMEOUT) {
      resetCornerSequence();
    }

    console.log("ornerSequenceRef.current", cornerSequenceRef.current);

    // 顺序正确
    if (corner === cornerSequenceRef.current) {
      cornerSequenceRef.current += 1;
      lastTapTimeRef.current = now;

      // 完成四角点击
      if (cornerSequenceRef.current === 4) {
        setShowDebug(true);
        resetHideTimer();
        resetCornerSequence();
      }
    } else {
      resetCornerSequence();
    }
  };

  // 清理
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => true} // ✅ 关键：接管所有触摸
      onTouchEnd={handleTouch} // ✅ 手指抬起时触发（最稳定）
    >
      {/* 内容 */}
      {children}

      {/* 调试按钮 */}
      {showDebug && (
        <TouchableOpacity
          style={styles.debugBtn}
          onPress={() => {
            onEditConfig?.();
            resetHideTimer();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.text}>修改会议室信息</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  debugBtn: {
    position: "absolute",
    right: 40,
    bottom: 40,
    backgroundColor: "#1677ff",
    padding: 10,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: "#FFF",
    fontSize: 12,
  },
});
