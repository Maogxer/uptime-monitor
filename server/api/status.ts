// server/api/status.ts
import type { Monitor } from '~/types/monitor'; // 建议为类型创建一个单独的文件

// 定义从 UptimeRobot API 返回的期望类型
interface UptimeRobotError {
  type: string;
  message: string;
}

interface UptimeRobotResponse {
  stat: 'ok' | 'fail';
  monitors: Monitor[];
  error?: UptimeRobotError;
}

// 使用 defineCachedEventHandler 增加缓存
export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.uptimeRobotApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'UptimeRobot API key is not configured.' });
  }

  // 计算60天前的Unix时间戳
  const logsStartDate = Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60);

  const apiParams = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    response_times: '1',
    response_times_limit: '30', // 最近30个响应时间点
    logs: '1',
    logs_limit: '50', // 最近50条日志
    logs_start_date: logsStartDate.toString(),
  });

  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors';

  try {
    const response = await $fetch<UptimeRobotResponse>(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: apiParams.toString(),
    });

    if (response.stat === 'fail') {
      throw createError({ statusCode: 500, statusMessage: `UptimeRobot API Error: ${response.error?.message || 'Unknown'}` });
    }
    return response.monitors;
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: `Failed to fetch from UptimeRobot API: ${error.message}` });
  }
}, {
  // 缓存配置
  name: 'uptimerobot_status_cache',
  maxAge: 60, // 缓存60秒
  // swr: true, // 可选：后台异步更新缓存
});

// 可选：在项目根目录创建 types/monitor.ts 来存放共享类型
/*
// types/monitor.ts
export interface Log { type: number; datetime: number; duration: number; }
export interface ResponseTime { datetime: number; value: number; }
export interface Monitor { id: number; friendly_name: string; status: number; logs: Log[]; response_times: ResponseTime[]; url: string; }
*/