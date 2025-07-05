// server/api/status.ts

// Helper function to get start and end dates for the logs
function getStartAndEndDates(days: number): string {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - (days * 24 * 60 * 60);
  return `${startDate}_${endDate}`;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.uptimeRobotApiKey;

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'UptimeRobot API key is not configured.' });
  }

  // We need logs for the last 60 days to build the heatmap
  const apiParams = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    response_times: '1',
    response_times_limit: '30',
    logs: '1', // <-- Request logs
    logs_limit: '50', // Max 50 log entries per monitor
    logs_start_date: getStartAndEndDates(60).split('_')[0], // <-- Start date 60 days ago
    logs_end_date: getStartAndEndDates(60).split('_')[1],   // <-- End date is today
  });

  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors';

  try {
    const response = await $fetch<any>(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
      body: apiParams.toString(),
    });

    if (response.stat === 'fail') {
      throw createError({ statusCode: 500, statusMessage: `UptimeRobot API Error: ${response.error?.message || 'Unknown'}` });
    }
    return response.monitors;
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: `Failed to fetch from UptimeRobot API: ${error.message}` });
  }
});