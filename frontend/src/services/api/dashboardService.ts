import { api } from '../../lib/axios';
import { type ExpenseItem } from './expenseService';
import { type ReminderItem } from './reminderService';

export interface DashboardMetricsData {
  expenses_month: number;
  expenses_trend: number;
  groceries_completed: number;
  groceries_total: number;
  pending_bills_count: number;
  active_reminders_count: number;
}

export interface DashboardBillItem {
  id: number;
  title: string;
  amount: number;
  category: string;
  due_date: string;
  status: 'Pending' | 'Overdue';
  due_in_days: number;
}

export interface DashboardNotificationItem {
  id: string;
  type: 'bill' | 'reminder' | 'grocery';
  priority: 'high' | 'medium' | 'low';
  message: string;
  date: string;
}

export interface DashboardActivityItem {
  id: number;
  description: string;
  created_at: string;
}

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getMetrics = async (): Promise<APIResponse<DashboardMetricsData>> => {
  const response = await api.get<APIResponse<DashboardMetricsData>>('/dashboard/metrics');
  return response.data;
};

export const getUpcomingBills = async (): Promise<APIResponse<DashboardBillItem[]>> => {
  const response = await api.get<APIResponse<DashboardBillItem[]>>('/dashboard/upcoming-bills');
  return response.data;
};

export const getTodayReminders = async (): Promise<APIResponse<ReminderItem[]>> => {
  const response = await api.get<APIResponse<ReminderItem[]>>('/dashboard/today-reminders');
  return response.data;
};

export const getRecentExpenses = async (): Promise<APIResponse<ExpenseItem[]>> => {
  const response = await api.get<APIResponse<ExpenseItem[]>>('/dashboard/recent-expenses');
  return response.data;
};

export const getNotifications = async (): Promise<APIResponse<DashboardNotificationItem[]>> => {
  const response = await api.get<APIResponse<DashboardNotificationItem[]>>('/dashboard/notifications');
  return response.data;
};

export const getRecentActivity = async (): Promise<APIResponse<DashboardActivityItem[]>> => {
  const response = await api.get<APIResponse<DashboardActivityItem[]>>('/dashboard/recent-activity');
  return response.data;
};
