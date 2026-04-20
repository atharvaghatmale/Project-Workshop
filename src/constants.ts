import { DashboardData, SystemLog, Metric } from './types';

export const MOCK_DATA: DashboardData[] = [
  { month: 'Jan', revenue: 45000, users: 12000, conversion: 2.4, anomalies: 2 },
  { month: 'Feb', revenue: 52000, users: 15000, conversion: 2.8, anomalies: 1 },
  { month: 'Mar', revenue: 48000, users: 14000, conversion: 2.5, anomalies: 5 },
  { month: 'Apr', revenue: 61000, users: 19000, conversion: 3.1, anomalies: 0 },
  { month: 'May', revenue: 58000, users: 18000, conversion: 2.9, anomalies: 2 },
  { month: 'Jun', revenue: 72000, users: 24000, conversion: 3.5, anomalies: 3 },
  { month: 'Jul', revenue: 85000, users: 28000, conversion: 3.8, anomalies: 1 },
  { month: 'Aug', revenue: 79000, users: 26000, conversion: 3.6, anomalies: 4 },
  { month: 'Sep', revenue: 91000, users: 31000, conversion: 4.1, anomalies: 2 },
  { month: 'Oct', revenue: 98000, users: 34000, conversion: 4.3, anomalies: 0 },
  { month: 'Nov', revenue: 105000, users: 38000, conversion: 4.6, anomalies: 1 },
  { month: 'Dec', revenue: 120000, users: 44000, conversion: 5.2, anomalies: 2 },
];

export const KPI_METRICS: Metric[] = [
  {
    id: 'rev',
    label: 'Total Revenue',
    value: 872400,
    change: 12.4,
    prefix: '$',
    trend: 'up',
    status: 'positive',
  },
  {
    id: 'usr',
    label: 'Active Users',
    value: 44000,
    change: 8.2,
    trend: 'up',
    status: 'positive',
  },
  {
    id: 'conv',
    label: 'Conversion Rate',
    value: 5.2,
    suffix: '%',
    change: -1.2,
    trend: 'down',
    status: 'negative',
  },
  {
    id: 'anom',
    label: 'System Anomalies',
    value: 23,
    change: 4,
    trend: 'up',
    status: 'negative',
  },
];

export const SYSTEM_LOGS: SystemLog[] = [
  { id: 'LOG-8842', timestamp: '2024-04-20 08:42:11', type: 'critical', message: 'API latency exceeded 500ms threshold', source: 'gateway-01' },
  { id: 'LOG-8840', timestamp: '2024-04-20 08:35:52', type: 'warning', message: 'Database pool nearing capacity', source: 'db-cluster-a' },
  { id: 'LOG-8839', timestamp: '2024-04-20 08:12:04', type: 'info', message: 'Daily backup sequence completed', source: 'sys-backup' },
  { id: 'LOG-8835', timestamp: '2024-04-20 07:55:18', type: 'critical', message: 'SSL certificate expiring in 48h', source: 'security-mgr' },
  { id: 'LOG-8831', timestamp: '2024-04-20 07:42:00', type: 'warning', message: 'Memory spike detected in worker-4', source: 'compute-node' },
];
