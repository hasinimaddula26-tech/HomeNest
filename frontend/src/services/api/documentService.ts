import { api } from '../../lib/axios';
import { API_BASE } from '../../config/env';

export interface DocumentItem {
  id: number;
  file_name: string;
  file_type: string;
  file_path: string;
  category: 'Identity' | 'Medical' | 'Financial' | 'Others';
  created_at: string;
}

export const getDocuments = async (): Promise<{ success: boolean; data?: DocumentItem[]; message?: string }> => {
  try {
    const res = await api.get('/documents');
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.detail || 'Failed to fetch documents' };
  }
};

export const uploadDocument = async (
  formData: FormData
): Promise<{ success: boolean; data?: DocumentItem; message?: string }> => {
  try {
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.detail || 'Failed to upload document' };
  }
};

export const deleteDocument = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.detail || 'Failed to delete document' };
  }
};

export const getDocumentFileUrl = (id: number): string => {
  // Return the full backend URL with authorization token as query parameter or we can fetch/render dynamically.
  // Wait! A cleaner way to download/view the file is to fetch it using axios as a blob, and create a local URL.
  // Let's implement that helper in the UI directly or here.
  return `${API_BASE}/documents/${id}/file`;
};
