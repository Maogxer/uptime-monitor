// file: server/api/monitors.ts

export default defineEventHandler(async (event) => {
  const { uptimeRobotApiKey } = useRuntimeConfig(event);

  if (!uptimeRobotApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'UptimeRobot API Key not configured.',
    });
  }

  try {
    const response = await $fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: `api_key=${uptimeRobotApiKey}&format=json&logs=1&logs_limit=1`,
    });

    if (response.stat === 'fail') {
       throw createError({
        statusCode: 500,
        statusMessage: response.error.message || 'Failed to fetch from UptimeRobot API.',
      });
    }

    // 可以在这里对 response.monitors 进行处理，使其结构更符合前端需求
    const monitors = response.monitors.map((monitor: any) => ({
      id: monitor.id,
      friendly_name: monitor.friendly_name,
      url: monitor.url,
      status: monitor.status, // 0-paused, 1-not checked yet, 2-up, 8-seems down, 9-down
      daily_ratio: monitor.custom_uptime_ratio || (monitor.all_time_uptime_ratio ? parseFloat(monitor.all_time_uptime_ratio).toFixed(2) : 'N/A'),
      log: monitor.logs.length > 0 ? monitor.logs[0] : null,
    }));

    return {
      monitors,
      // 你可以添加其他全局信息
      generatedAt: new Date().toISOString(),
    };

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An internal server error occurred.',
    });
  }
});