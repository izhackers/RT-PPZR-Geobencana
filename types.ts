
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  chartData?: any;
}

export interface DashboardData {
  name: string;
  content: string;
  type: 'csv' | 'json' | 'text';
  uploadedAt: Date;
}

export interface KPI {
  label: string;
  value: string | number;
  trend?: string;
}

export interface DashboardSummary {
  kpis: KPI[];
  charts: {
    type: 'bar' | 'line' | 'area' | 'pie';
    data: any[];
    title: string;
  }[];
  summaryText: string;
}
