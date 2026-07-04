import { api } from '../../lib/axios';

export interface ReminderItem {
  id: number;
  title: string;
  description?: string;
  type: 'Medicine' | 'Birthday' | 'Bill' | 'Meeting' | 'Shopping' | 'Maintenance' | 'Custom' | 'General';
  date: string;
  is_completed: boolean;
  created_at: string;
}

export interface ReminderFormValues {
  title: string;
  description?: string;
  type: string;
  date: string;
  is_completed?: boolean;
}

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getReminders = async (): Promise<APIResponse<ReminderItem[]>> => {
  const response = await api.get<APIResponse<ReminderItem[]>>('/reminders');
  return response.data;
};

export const createReminder = async (
  item: ReminderFormValues
): Promise<APIResponse<ReminderItem>> => {
  const response = await api.post<APIResponse<ReminderItem>>('/reminders', item);
  return response.data;
};

export const updateReminder = async (
  id: number,
  item: Partial<ReminderItem>
): Promise<APIResponse<ReminderItem>> => {
  const response = await api.put<APIResponse<ReminderItem>>(`/reminders/${id}`, item);
  return response.data;
};

export const deleteReminder = async (id: number): Promise<APIResponse<null>> => {
  const response = await api.delete<APIResponse<null>>(`/reminders/${id}`);
  return response.data;
};
