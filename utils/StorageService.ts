import AsyncStorage from "@react-native-async-storage/async-storage";

// 存储键名常量
export const STORAGE_KEYS = {
  ROOM_ID: "meeting_room_id",
  APP_ID: "meeting_app_id",
  APP_SECRET: "meeting_app_secret",
  TENANT_TOKEN: "tenant_access_token",
  TOKEN_EXPIRE_TIME: "token_expire_time", // 记录token过期时间（2小时）
};

/**
 * 存储数据到本地
 * @param key 存储键名
 * @param value 存储值
 */
export const setStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error("存储失败:", e);
    return false;
  }
};

/**
 * 从本地读取数据
 * @param key 存储键名
 */
export const getStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error("读取失败:", e);
    return null;
  }
};

/**
 * 删除本地数据
 * @param key 存储键名
 */
export const removeStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error("删除失败:", e);
    return false;
  }
};
