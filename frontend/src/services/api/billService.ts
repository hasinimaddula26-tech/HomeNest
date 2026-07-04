import { api } from '../../lib/axios';

export interface BillItem {
  id: number;
  title: string;
  amount: number;
  category: string;
  due_date: string;
  is_paid: boolean;
  status: 'Pending' | 'Paid' | 'Overdue';
  created_at: string;
}

export interface BillFormValues {
  title: string;
  amount: number;
  category: string;
  due_date: string;
  is_paid?: boolean;
}

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getBills = async (): Promise<APIResponse<BillItem[]>> => {
  const response = await api.get<APIResponse<BillItem[]>>('/bills');
  return response.data;
};

export const createBill = async (
  item: BillFormValues
): Promise<APIResponse<BillItem>> => {
  const response = await api.post<APIResponse<BillItem>>('/bills', item);
  return response.data;
};

export const updateBill = async (
  id: number,
  item: Partial<BillItem>
): Promise<APIResponse<BillItem>> => {
  const response = await api.put<APIResponse<BillItem>>(`/bills/${id}`, item);
  return response.data;
};

export const deleteBill = async (id: number): Promise<APIResponse<null>> => {
  const response = await api.delete<APIResponse<null>>(`/bills/${id}`);
  return response.data;
};
