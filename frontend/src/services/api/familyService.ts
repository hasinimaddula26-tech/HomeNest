import { api } from '../../lib/axios';

export interface FamilyMemberItem {
  id: number;
  name: string;
  relation: 'Parent' | 'Spouse' | 'Sibling' | 'Child' | 'Grandparent' | 'Others';
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  birthday: string;
  emergency_contact: string;
  photo_url?: string;
  created_at: string;
}

export interface FamilyMemberFormValues {
  name: string;
  relation: string;
  blood_group: string;
  birthday: string;
  emergency_contact: string;
  photo_url?: string;
}

export const getFamilyMembers = async (): Promise<{ success: boolean; data?: FamilyMemberItem[]; message?: string }> => {
  try {
    const res = await api.get('/family');
    return res.data;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, message: (err as any).response?.data?.detail || 'Failed to fetch family members' };
  }
};

export const createFamilyMember = async (
  values: FamilyMemberFormValues
): Promise<{ success: boolean; data?: FamilyMemberItem; message?: string }> => {
  try {
    const res = await api.post('/family', values);
    return res.data;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, message: (err as any).response?.data?.detail || 'Failed to add family member' };
  }
};

export const deleteFamilyMember = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await api.delete(`/family/${id}`);
    return res.data;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, message: (err as any).response?.data?.detail || 'Failed to delete family member' };
  }
};
