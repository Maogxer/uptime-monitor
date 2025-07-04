import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const { uptimeRobotApiKey } = useRuntimeConfig(event)

  if (!uptimeRobotApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'UptimeRobot API Key not configured.',
    })
  }

  // 计算过去90天的时间范围，格式为 UptimeRobot 需要的 DD-MM-YYYY
  const endDate = dayjs()
  const startDate = endDate.subtract(89, 'day') // 包括今天，所以是减89天
  const dateRange = `${startDate.format('DD-MM-YYYY')}_${endDate.format('DD-MM-YYYY')}`

  try {
    // 请求 UptimeRobot API，增加 custom_uptime_ratios 参数
    const response = await $fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      // 注意增加了 custom_uptime_ratios 参数
      body: `api_key=${uptimeRobotApiKey}&format=json&logs=1&custom_uptime_ratios=${dateRange}`,
    })

    if (response.stat === 'fail') {
      throw createError({
        statusCode: 500,
        statusMessage: response.error.message || 'Failed to fetch from UptimeRobot API.',
      })
    }
    
    // 映射和处理返回的数据
    const monitors = response.monitors.map((monitor: any) => {
      // UptimeRobot 返回的 ratios 是一个用-连接的字符串，例如 "100.000-99.500-100.000"
      const dailyRatios = monitor.custom_uptime_ratios
        ? monitor.custom_uptime_ratios.split('-').map(Number)
        : []

      return {
        id: monitor.id,
        friendly_name: monitor.friendly_name,
        url: monitor.url,
        status: monitor.status, // 2-up, 9-down, etc.
        // 最近60天或90天的总可用率
        ratio: monitor.custom_uptime_ratio,
        dailyRatios: dailyRatios, // 每日可用率数组
        log: monitor.logs.length > 0 ? monitor.logs[0] : null,
      }
    })

    return {
      monitors,
      generatedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Error fetching UptimeRobot data:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An internal server error occurred while fetching monitor data.',
    })
  }
})