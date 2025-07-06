// server/api/status.ts
import type { UptimeRobotResponse } from '~/types/monitor';

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.uptimeRobotApiKey;
  
  const query = getQuery(event);
  const monitorId = query.id as string | undefined;

  if (!apiKey) {
    // No console.log needed, just throw the error for the frontend to catch.
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
  
  if (monitorId) {
    apiParams.set('monitors', monitorId);
    apiParams.set('response_times_limit', '168'); 
  } else {
    apiParams.set('response_times_limit', '30'); 
  }

  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors';

  try {
    const response = await $fetch<UptimeRobotResponse>(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: apiParams,
    });
    
    // If the API call itself succeeds but UptimeRobot reports an error,
    // throw a descriptive error for the frontend.
    if (response.stat === 'fail') {
      throw createError({ 
        statusCode: 502, // Bad Gateway - indicates an error from the upstream server
        statusMessage: `UptimeRobot API Error: ${response.error?.message || 'Unknown error'}` 
      });
    }
    
    return response.monitors; 
  } catch (error: any) {
    // If the fetch call itself fails (network error, etc.), re-throw it as a standard Nuxt error.
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: `Failed to fetch from UptimeRobot API: ${error.message}` 
    });
  }
}, {
  name: 'uptimerobot_status_cache',
  group: 'uptimerobot',
  getKey: (event) => {
    const query = getQuery(event);
    const monitorId = query.id as string | undefined;
    return monitorId || 'all'; 
  },
  maxAge: 60, // Cache for 60 seconds
});