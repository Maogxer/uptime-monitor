// This file handles the server-side fetching from UptimeRobot API
// It's a server route that our frontend will call
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.uptimeRobotApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'UptimeRobot API key is not configured.',
    });
  }

  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors';

  try {
    const response = await $fetch<UptimeRobotResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      body: `api_key=${apiKey}&format=json&custom_uptime_ratios=1-7-30-90&response_times=1&response_times_limit=30&logs=1`,
    });

    if (response.stat === 'fail') {
      throw createError({
        statusCode: 500,
        statusMessage: `UptimeRobot API Error: ${response.error?.message || 'Unknown error'}`,
      });
    }

    return response.monitors;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch from UptimeRobot API: ${error.message}`,
    });
  }
});


// Define TypeScript interfaces for the UptimeRobot API response
interface UptimeRobotResponse {
  stat: 'ok' | 'fail';
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  monitors: Monitor[];
  error?: {
    type: string;
    message: string;
  };
}

export interface Monitor {
  id: number;
  friendly_name: string;
  url: string;
  type: number;
  status: number; // 2=up, 8=seems down, 9=down
  custom_uptime_ratios: string; // e.g., "7-30-90"
  response_times: ResponseTime[];
  // Add other properties you might need
}

interface ResponseTime {
  datetime: number; // Unix timestamp
  value: number; // in ms
}