// utils/StorageService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/Config";

// ========== 1. 业务类型定义（补全你的字段即可） ==========
export interface RoomInfo {
  roomId: string;
  // 在这里补全你的业务字段，示例：
  // roomName: string;
  // meetingStartTime: string;
  // capacity: number;
}

// ========== 2. 全局类型映射（一劳永逸，新增存储只改这里） ==========
// 定义每个存储key对应的数值类型，彻底告别any，实现全链路类型安全
type StorageKeyTypeMap = {
  [STORAGE_KEYS.ROOM_ID]: RoomInfo;
  // 后续新增存储，只需要在这里加一行类型映射即可，示例：
  // [STORAGE_KEYS.USER_INFO]: UserInfo;
  // [STORAGE_KEYS.APP_SETTINGS]: AppSettings;
};

// ========== 3. 通用类型安全存储核心方法 ==========
/**
 * 通用存储方法：自动处理key类型转换、序列化、错误捕获
 * @param key 存储key（支持number/string，自动转string）
 * @param data 严格匹配类型的存储数据
 */
export const setStorage = async <K extends keyof StorageKeyTypeMap>(
  key: K,
  data: StorageKeyTypeMap[K],
) => {
  try {
    // 自动把number类型的key转成string，彻底解决key不支持number的问题
    const storageKey = String(key);
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`✅ 存储成功：${storageKey}`);
    return true;
  } catch (err) {
    console.error(`❌ 存储失败：${String(key)}`, err);
    return false;
  }
};

/**
 * 通用读取方法：自动返回对应类型的数据，无类型丢失
 * @param key 存储key（支持number/string）
 * @returns 严格类型的存储数据 | null
 */
export const getStorage = async <K extends keyof StorageKeyTypeMap>(
  key: K,
): Promise<StorageKeyTypeMap[K] | null> => {
  try {
    const storageKey = String(key);
    const value = await AsyncStorage.getItem(storageKey);
    if (!value) return null;
    return JSON.parse(value) as StorageKeyTypeMap[K];
  } catch (err) {
    console.error(`❌ 读取失败：${String(key)}`, err);
    return null;
  }
};

/**
 * 通用删除方法：自动处理key类型转换
 * @param key 存储key（支持number/string）
 */
export const removeStorage = async <K extends keyof StorageKeyTypeMap>(
  key: K,
) => {
  try {
    const storageKey = String(key);
    await AsyncStorage.removeItem(storageKey);
    console.log(`✅ 删除成功：${storageKey}`);
    return true;
  } catch (err) {
    console.error(`❌ 删除失败：${String(key)}`, err);
    return false;
  }
};

// ========== 4. 业务层快捷调用（直接复制到页面用） ==========
// 存储会议室信息
export const saveMeetingRoomId = (data: RoomInfo) =>
  setStorage(STORAGE_KEYS.ROOM_ID, data);
// 读取会议室信息
export const getMeetingRoomId = () => getStorage(STORAGE_KEYS.ROOM_ID);
// 清除会议室信息
export const clearMeetingRoomId = () => removeStorage(STORAGE_KEYS.ROOM_ID);
