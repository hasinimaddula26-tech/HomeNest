import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTrash2, FiCheckSquare, FiSquare, FiAlertCircle } from 'react-icons/fi';
import * as reminderService from '../../services/api/reminderService';
import { type ReminderItem, type ReminderFormValues } from '../../services/api/reminderService';

const reminderSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title must be under 100 characters'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  date: z.string().min(1, 'Date is required'),
});

const REMINDER_TYPES = [
  { value: 'Medicine', label: 'Medicine', emoji: '💊' },
  { value: 'Birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'Bill', label: 'Bill Payment', emoji: '🧾' },
  { value: 'Meeting', label: 'Meeting', emoji: '👥' },
  { value: 'Shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'Maintenance', label: 'Maintenance', emoji: '🔧' },
  { value: 'Custom', label: 'Custom', emoji: '🎯' },
  { value: 'General', label: 'General', emoji: '📌' },
];

const Reminders: React.FC = () => {
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<ReminderItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'General',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await reminderService.getReminders();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setError(res.message || 'Failed to fetch reminders');
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
      fetchItems();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAddReminder = async (values: ReminderFormValues) => {
    try {
      setIsSubmitLoading(true);
      const res = await reminderService.createReminder(values);
      if (res.success && res.data) {
        setItems([...items, res.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        toast.success('Reminder added successfully!');
        reset();
      } else {
        toast.error(res.message || 'Failed to add reminder');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleToggleComplete = async (id: number, currentCompleted: boolean) => {
    try {
      const res = await reminderService.updateReminder(id, { is_completed: !currentCompleted });
      if (res.success && res.data) {
        setItems(items.map((item) => (item.id === id ? res.data! : item)));
        toast.success(!currentCompleted ? 'Reminder completed! 🎉' : 'Reminder active');
      } else {
        toast.error(res.message || 'Failed to update reminder');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const res = await reminderService.deleteReminder(deleteItem.id);
      if (res.success) {
        setItems(items.filter((item) => item.id !== deleteItem.id));
        toast.success('Reminder deleted successfully!');
      } else {
        toast.error(res.message || 'Failed to delete reminder');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setDeleteItem(null);
    }
  };

  const getTypeEmoji = (typeStr: string) => {
    return REMINDER_TYPES.find(t => t.value === typeStr)?.emoji || '📌';
  };

  const formatDate = (dateStr: string) => {
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
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">🔔 Reminders</h1>
              <p className="text-slate-500 text-sm mt-1">Manage family alarms, medicines, events, and shopping times.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Reminders</p>
                <p className="text-base font-extrabold text-secondary">
                  {items.filter((i) => !i.is_completed).length} items
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-secondary text-base">➕ Set Reminder</h3>
              
              <form onSubmit={handleSubmit(handleAddReminder)} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-xs font-semibold text-slate-500 mb-1">Reminder Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Grandma's medicine"
                    {...register('title')}
                    className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                      errors.title ? 'border-error/50 focus:border-error' : 'border-slate-200'
                    }`}
                  />
                  {errors.title && <span className="text-[10px] font-bold text-error mt-1">{errors.title.message as string}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="description" className="text-xs font-semibold text-slate-500 mb-1">Notes (Optional)</label>
                  <textarea
                    id="description"
                    rows={2}
                    placeholder="Add description..."
                    {...register('description')}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="type" className="text-xs font-semibold text-slate-500 mb-1">Type</label>
                    <select
                      id="type"
                      {...register('type')}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                    >
                      {REMINDER_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="date" className="text-xs font-semibold text-slate-500 mb-1">Date</label>
                    <input
                      id="date"
                      type="date"
                      {...register('date')}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm text-sm disabled:opacity-50 mt-2"
                >
                  {isSubmitLoading ? 'Saving...' : 'Set Reminder'}
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-8 space-y-4">
              {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-xs font-semibold">⚠️ {error}</div>}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Loading reminders list...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl">📌</span>
                  <p className="font-bold text-secondary text-sm">No reminders set</p>
                  <p className="text-xs max-w-xs mx-auto">Track tasks, anniversaries, and custom alerts easily.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Toggle Checkbox Icon */}
                        <button
                          onClick={() => handleToggleComplete(item.id, item.is_completed)}
                          className={`mt-0.5 p-0.5 rounded-md transition-all focus:outline-none ${
                            item.is_completed ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-primary'
                          }`}
                        >
                          {item.is_completed ? <FiCheckSquare size={22} /> : <FiSquare size={22} />}
                        </button>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl leading-none">{getTypeEmoji(item.type)}</span>
                            <h4 className={`font-bold text-secondary text-sm md:text-base ${item.is_completed ? 'line-through text-slate-400' : ''}`}>
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400">Scheduled for {formatDate(item.date)}</p>
                          {item.description && <p className="text-xs text-slate-500 mt-1 italic">"{item.description}"</p>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          item.is_completed 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {item.is_completed ? 'Completed' : 'Active'}
                        </span>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="text-slate-400 hover:text-error hover:bg-rose-50 p-2 rounded-xl transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FiAlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-secondary text-base">Delete Reminder?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove the reminder for <strong>"{deleteItem.title}"</strong>?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteItem(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-error hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Reminders;
