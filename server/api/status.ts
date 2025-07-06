// server/api/status.ts
import type { UptimeRobotResponse } from '~/types/monitor';

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.uptimeRobotApiKey;
  
  // NEW: Get query parameters from the request URL
  const query = getQuery(event);
  const monitorId = query.id as string | undefined;

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'UptimeRobot API key is not configured.' });
  }

  const logsStartDate = Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60);

  const apiParams = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    response_times: '1',
    logs: '1',
    logs_limit: '50',
    logs_start_date: logsStartDate.toString(),
  });
  
  // NEW: If a specific ID is provided, add it to the API parameters
  if (monitorId) {
    apiParams.set('monitors', monitorId);
    // For a single monitor, we can ask for more response time data points
    apiParams.set('response_times_limit', '168'); // ~24 hours if polled every 15 mins
  } else {
    apiParams.set('response_times_limit', '30'); 
  }

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
    // UptimeRobot always returns an array, even for a single monitor request.
    return response.monitors; 
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: `Failed to fetch from UptimeRobot API: ${error.message}` });
  }
}, {
  // NEW: Make the cache key dynamic to avoid conflicts
  name: 'uptimerobot_status_cache',
  group: 'uptimerobot',
  getKey: (event) => {
    const query = getQuery(event);
    const monitorId = query.id as string | undefined;
    // Cache for 'all' is different from cache for a specific ID
    return monitorId || 'all'; 
  },
  maxAge: 60,
});