// utils/StorageService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/Config";

// 会议室信息类型
export type RoomInfo = {
  roomId: string;
};

/**
 * 存储会议室信息到本地
 */
export const saveRoomInfo = async (roomInfo: RoomInfo) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ROOM_ID, JSON.stringify(roomInfo));
    return true;
  } catch (error) {
    console.error("[存储失败] 会议室信息", error);
    return false;
  }
};

/**
 * 读取本地会议室信息
 */
export const getRoomInfo = async (): Promise<RoomInfo | null> => {
  try {
    const cacheStr = await AsyncStorage.getItem(STORAGE_KEYS.ROOM_ID);
    if (!cacheStr) return null;
    return JSON.parse(cacheStr) as RoomInfo;
  } catch (error) {
    console.error("[读取失败] 会议室信息", error);
    return null;
  }
};

/**
 * 清除本地会议室信息（重置用）
 */
export const clearRoomInfo = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ROOM_ID);
    return true;
  } catch (error) {
    console.error("[清除失败] 会议室信息", error);
    return false;
  }
};
