import axios from "axios";
import { getStorage, setStorage, STORAGE_KEYS } from "@/utils/StorageService";

// 飞书配置（替换为你的实际值）
const FEISHU_CONFIG = {
  // APP_ID: "cli_a93ddaa2f2bb9bc3",
  // APP_SECRET: "jYNtpr5fziKlRs5FD5Bnhd0gDmNj1OAY",
  // BASE_URL: "http://localhost:3000/api/feishu", // 代理服务器地址（安卓模拟器/真机替换为电脑IP）
  BASE_URL: "https://open.feishu.cn/open-apis", // 原生端调试（无代理）时用这个
};

// 创建axios实例
const feishuAxios = axios.create({
  baseURL: FEISHU_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 1. 获取飞书tenant_access_token（POST + Body）
 */
export const getTenantToken = async () => {
  try {
    // 先检查本地token是否未过期
    const [token, expireTimeStr] = await Promise.all([
      getStorage(STORAGE_KEYS.TENANT_TOKEN),
      getStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME),
    ]);

    const expireTime = expireTimeStr ? Number(expireTimeStr) : 0;

    // token有效则直接返回
    if (token && Date.now() < expireTime) {
      // console.log("使用本地缓存的Token");
      return token;
    }

    // 同时获取appId和appSecret，确保它们存在
    const appId = await getStorage(STORAGE_KEYS.APP_ID);
    const appSecret = await getStorage(STORAGE_KEYS.APP_SECRET);

    if (!appId || !appSecret) {
      throw new Error("缺少飞书应用配置");
    }

    // 调用接口获取新token
    const res = await feishuAxios.post(
      "/auth/v3/tenant_access_token/internal",
      {
        app_id: appId,
        app_secret: appSecret,
      },
    );

    if (res.data.code === 0) {
      const newToken = res?.data?.tenant_access_token;
      const expiresIn = res?.data?.expire || 7200; // 默认2小时
      const newExpireTime = Date.now() + expiresIn * 1000;

      // 存储新token和过期时间
      await Promise.all([
        setStorage(STORAGE_KEYS.TENANT_TOKEN, newToken),
        setStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME, newExpireTime.toString()),
      ]);
      return newToken;
    } else {
      throw new Error(
        `获取Token失败：${res?.data?.msg}（code:${res?.data?.code}）`,
      );
    }
  } catch (e) {
    throw e;
  }
};

/**
 * 2. 空闲会议室查询（GET + Query参数）
 * @param roomIds 会议室ID列表（数组，如 ['room123']）
 * @param startDate 开始时间（格式：YYYY-MM-DD HH:mm:ss）
 * @param endDate 结束时间（格式：YYYY-MM-DD HH:mm:ss）
 */
export const getFreeBusyMeetingRoom = async (
  time_min: string,
  time_max: string,
) => {
  try {
    const token = await getTenantToken();
    const roomIds = await Promise.all([getStorage(STORAGE_KEYS.ROOM_ID)]);

    // 关键修正：GET请求 + Query参数
    const res = await feishuAxios.get("/meeting_room/freebusy/batch_get", {
      params: {
        room_ids: roomIds.join(","), // Query参数要求字符串（多个ID用逗号分隔）
        time_min: time_min,
        time_max: time_max,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.data?.code === 0) {
      // console.log("空闲会议室查询成功：", res.data.data);
      return res?.data?.data;
    } else {
      throw new Error(
        `空闲会议室查询失败：${res?.data?.msg}（code:${res?.data?.code}）`,
      );
    }
  } catch (e) {
    // console.error("getFreeBusyMeetingRoom 错误：", (e as Error).message);
    throw e;
  }
};

/**
 * 3. 会议室日程主题查询（POST + Body）
 * @param roomIds 会议室ID列表
 * @param startDate 开始时间
 * @param endDate 结束时间
 */
export const getMeetingRoomSummary = async (
  eventUids: { uid: string; original_time: number }[],
) => {
  try {
    const token = await getTenantToken();

    const res = await feishuAxios.post(
      "/meeting_room/summary/batch_get",
      { EventUids: eventUids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res?.data?.code === 0) {
      // console.log("会议室主题查询成功：", res.data.data);
      return res?.data?.data;
    } else {
      throw new Error(
        `会议室主题查询失败：${res?.data?.msg}（code:${res?.data?.code}）`,
      );
    }
  } catch (e) {
    // console.error("getMeetingRoomSummary 错误：", (e as Error).message);
    throw e;
  }
};
