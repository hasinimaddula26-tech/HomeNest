import { api } from '../../lib/axios';
import { type GroceryFormValues } from '../../components/grocery/GroceryForm';
import { type GroceryItem } from '../../components/grocery/GroceryCard';

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getGroceries = async (): Promise<APIResponse<GroceryItem[]>> => {
  const response = await api.get<APIResponse<GroceryItem[]>>('/groceries');
  return response.data;
};

export const createGrocery = async (
  item: GroceryFormValues
): Promise<APIResponse<GroceryItem>> => {
  const response = await api.post<APIResponse<GroceryItem>>('/groceries', item);
  return response.data;
};

export const updateGrocery = async (
  id: number,
  item: Partial<GroceryItem>
): Promise<APIResponse<GroceryItem>> => {
  const response = await api.put<APIResponse<GroceryItem>>(`/groceries/${id}`, item);
  return response.data;
};

export const deleteGrocery = async (id: number): Promise<APIResponse<null>> => {
  const response = await api.delete<APIResponse<null>>(`/groceries/${id}`);
  return response.data;
};
