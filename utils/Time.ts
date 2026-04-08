/**
 * 判断当前时间 与 ISO8601时间 的早晚
 * @param isoTime ISO8601格式时间（如 2026-03-18T11:00:00+08:00）
 * @returns 1:当前更晚 | -1:当前更早 | 0:时间相同
 */

export function compareNowWithISO(isoTime: string): number {
  const now = new Date().getTime();
  const target = new Date(isoTime).getTime();
  if (now > target) return 1;
  if (now < target) return -1;
  return 0;
}

// ------------------- 业务专用：判断会议状态（你的项目必用） -------------------
/**
 * 判断会议是 未开始 / 进行中 / 已结束
 * @param startTime 会议开始时间(ISO)
 * @param endTime 会议结束时间(ISO)
 */
export function getMeetingStatus(startTime: string, endTime: string) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // console.log("@--当前时间:", now);
  // console.log("@--会议开始时间:", startTime, start);
  // console.log("@--会议结束时间:", startTime, end);

  if (now < start) return "未开始";
  if (now > end) return "已结束";
  return "进行中";
}

/**
 * 将 Date 对象 转为 飞书要求的 ISO8601 格式 (东八区 +08:00)
 * 示例输出：2026-03-18T15:30:00+08:00
 */
export function toFeishuDateTime(date: Date): string {
  // 格式化年份
  const year = date.getFullYear();
  // 格式化月份（补0）
  const month = String(date.getMonth() + 1).padStart(2, "0");
  // 格式化日期（补0）
  const day = String(date.getDate()).padStart(2, "0");
  // 格式化小时
  const hours = String(date.getHours()).padStart(2, "0");
  // 格式化分钟
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // 格式化秒
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 拼接成飞书标准格式
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
}

/**
 * 获取【当前时间】的飞书标准格式（最常用）
 */
export function getCurrentFeishuTime(): string {
  return toFeishuDateTime(new Date());
}

/**
 * 从 ISO8601 时间中 截取时分（HH:mm）
 * 示例：2026-03-18T12:00:00+08:00 → 12:00
 */
export function getHourMinute(isoTime: string): string {
  if (!isoTime) return "未知时间";
  // ✅ 方法1：固定格式截取（最快，你的场景完美适用）
  return isoTime.substring(11, 16);

  // ✅ 方法2：Date对象解析（通用无坑，兼容所有时区格式）
  // const date = new Date(isoTime);
  // const hours = String(date.getHours()).padStart(2, '0');
  // const minutes = String(date.getMinutes()).padStart(2, '0');
  // return `${hours}:${minutes}`;
}
