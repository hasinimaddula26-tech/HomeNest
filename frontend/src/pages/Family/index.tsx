import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTrash2, FiPhone, FiAlertCircle, FiPlus, FiCalendar } from 'react-icons/fi';
import * as familyService from '../../services/api/familyService';
import { type FamilyMemberItem, type FamilyMemberFormValues } from '../../services/api/familyService';

const familySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  relation: z.string().min(1, 'Relation is required'),
  blood_group: z.string().min(1, 'Blood group is required'),
  birthday: z.string().min(1, 'Birthday is required'),
  emergency_contact: z.string().min(5, 'Emergency contact must be at least 5 digits').max(20, 'Emergency contact is too long'),
});

const RELATIONS = [
  { value: 'Parent', label: 'Parent', emoji: '👩' },
  { value: 'Spouse', label: 'Spouse', emoji: '💑' },
  { value: 'Sibling', label: 'Sibling', emoji: '🧑‍🤝‍🧑' },
  { value: 'Child', label: 'Child', emoji: '👶' },
  { value: 'Grandparent', label: 'Grandparent', emoji: '👵' },
  { value: 'Others', label: 'Other', emoji: '👤' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Family: React.FC = () => {
  const [members, setMembers] = useState<FamilyMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteMember, setDeleteMember] = useState<FamilyMemberItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: '',
      relation: 'Others',
      blood_group: 'O+',
      birthday: '',
      emergency_contact: '',
    },
  });

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await familyService.getFamilyMembers();
      if (res.success && res.data) {
        setMembers(res.data);
      } else {
        setError(res.message || 'Failed to fetch family members');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAddMember = async (values: FamilyMemberFormValues) => {
    try {
      setIsSubmitLoading(true);
      const res = await familyService.createFamilyMember(values);
      if (res.success && res.data) {
        setMembers([...members, res.data].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Family member added to directory!');
        reset();
        setIsFormOpen(false);
      } else {
        toast.error(res.message || 'Failed to add family member');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMember) return;
    try {
      const res = await familyService.deleteFamilyMember(deleteMember.id);
      if (res.success) {
        setMembers(members.filter((m) => m.id !== deleteMember.id));
        toast.success('Family member removed successfully!');
      } else {
        toast.error(res.message || 'Failed to delete family member');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setDeleteMember(null);
    }
  };

  const getRelationEmoji = (relationStr: string) => {
    return RELATIONS.find((r) => r.value === relationStr)?.emoji || '👤';
  };

  const formatBirthday = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">👪 Family Directory</h1>
              <p className="text-slate-500 text-sm mt-1">
                Keep emergency contacts, blood groups, and details of family members in one place.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-primary hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm flex items-center gap-2 self-start sm:self-center"
            >
              <FiPlus size={16} /> Add Member
            </button>
          </div>

          {/* Quick Add Form Drawer/Collapse */}
          {isFormOpen && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-secondary text-base">➕ Add Family Member</h3>
              <form onSubmit={handleSubmit(handleAddMember)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    {...register('name')}
                    className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                      errors.name ? 'border-error/50 focus:border-error' : 'border-slate-200'
                    }`}
                  />
                  {errors.name && <span className="text-[10px] font-bold text-error mt-1">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="relation" className="text-xs font-semibold text-slate-500 mb-1">Relationship</label>
                  <select
                    id="relation"
                    {...register('relation')}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                  >
                    {RELATIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.emoji} {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="blood_group" className="text-xs font-semibold text-slate-500 mb-1">Blood Group</label>
                  <select
                    id="blood_group"
                    {...register('blood_group')}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        🩸 {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="birthday" className="text-xs font-semibold text-slate-500 mb-1">Birthday</label>
                  <input
                    id="birthday"
                    type="date"
                    {...register('birthday')}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="emergency_contact" className="text-xs font-semibold text-slate-500 mb-1">Emergency Contact</label>
                  <input
                    id="emergency_contact"
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    {...register('emergency_contact')}
                    className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                      errors.emergency_contact ? 'border-error/50 focus:border-error' : 'border-slate-200'
                    }`}
                  />
                  {errors.emergency_contact && (
                    <span className="text-[10px] font-bold text-error mt-1">{errors.emergency_contact.message}</span>
                  )}
                </div>

                <div className="flex items-end justify-end gap-3 md:col-span-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitLoading}
                    className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50"
                  >
                    {isSubmitLoading ? 'Saving...' : 'Save Member'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-xs font-semibold">⚠️ {error}</div>}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading family directory...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-16 text-center text-slate-400 space-y-2">
              <span className="text-4xl">👪</span>
              <p className="font-bold text-secondary text-sm">Directory is empty</p>
              <p className="text-xs max-w-sm mx-auto">Add family members to keep emergency phone lines and blood profiles organized.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-2xl shadow-3xs">
                        {getRelationEmoji(m.relation)}
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary text-sm md:text-base leading-tight">{m.name}</h3>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {m.relation}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteMember(m)}
                      className="text-slate-300 hover:text-error hover:bg-rose-50 p-1.5 rounded-lg transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FiCalendar size={11} /> Birthday
                      </p>
                      <p className="text-xs font-bold text-secondary">{formatBirthday(m.birthday)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        🩸 Blood Group
                      </p>
                      <p className="text-xs font-bold text-rose-600">{m.blood_group}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${m.emergency_contact}`}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 border border-emerald-100 shadow-3xs"
                  >
                    <FiPhone size={13} /> {m.emergency_contact}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      {deleteMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FiAlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-secondary text-base">Remove Member?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove <strong>"{deleteMember.name}"</strong> from the directory?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteMember(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-error hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Family;
