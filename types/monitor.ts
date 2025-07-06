// types/monitor.ts
export interface Log {
  type: number;
  datetime: number;
  duration: number;
}

export interface ResponseTime {
  datetime: number;
  value: number;
}

export interface Monitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number; // 2: up, 8/9: down, 0: paused
  logs: Log[];
  response_times: ResponseTime[];
}

// UptimeRobot API 响应的完整类型
export interface UptimeRobotResponse {
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