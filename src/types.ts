export interface DashboardData {
  month: string;
  revenue: number;
  users: number;
  conversion: number;
  anomalies: number;
}

export interface Metric {
  id: string;
  label: string;
  description: string;
  value: string | number;
  change: number;
  prefix?: string;
  suffix?: string;
  trend: 'up' | 'down' | 'neutral';
  status: 'positive' | 'negative' | 'neutral';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  source: string;
}

export type ChartType = 'Area' | 'Line' | 'Bar' | 'Pie';
