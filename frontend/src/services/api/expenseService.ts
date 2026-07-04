import { api } from '../../lib/axios';

export interface ExpenseItem {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface ExpenseFormValues {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface ExpenseSummaryData {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getExpenses = async (): Promise<APIResponse<ExpenseItem[]>> => {
  const response = await api.get<APIResponse<ExpenseItem[]>>('/expenses');
  return response.data;
};

export const createExpense = async (
  item: ExpenseFormValues
): Promise<APIResponse<ExpenseItem>> => {
  const response = await api.post<APIResponse<ExpenseItem>>('/expenses', item);
  return response.data;
};

export const updateExpense = async (
  id: number,
  item: Partial<ExpenseItem>
): Promise<APIResponse<ExpenseItem>> => {
  const response = await api.put<APIResponse<ExpenseItem>>(`/expenses/${id}`, item);
  return response.data;
};

export const deleteExpense = async (id: number): Promise<APIResponse<null>> => {
  const response = await api.delete<APIResponse<null>>(`/expenses/${id}`);
  return response.data;
};

export const getExpensesSummary = async (): Promise<APIResponse<ExpenseSummaryData>> => {
  const response = await api.get<APIResponse<ExpenseSummaryData>>('/expenses/summary');
  return response.data;
};
