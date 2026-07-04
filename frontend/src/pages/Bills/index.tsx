import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTrash2, FiCheckCircle, FiCircle, FiAlertCircle } from 'react-icons/fi';
import * as billService from '../../services/api/billService';
import { type BillItem, type BillFormValues } from '../../services/api/billService';

const billSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title must be under 100 characters'),
  amount: z.coerce.number().min(0.01, 'Amount must be at least ₹0.01'),
  category: z.string().min(1, 'Category is required'),
  due_date: z.string().min(1, 'Due date is required'),
});

const BILL_CATEGORIES = ['Electricity', 'Water', 'Internet', 'Gas', 'Rent', 'Others'] as const;

const Bills: React.FC = () => {
  const [items, setItems] = useState<BillItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<BillItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: 'Others',
      due_date: new Date().toISOString().split('T')[0],
    },
  });

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await billService.getBills();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setError(res.message || 'Failed to fetch bills');
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

  const handleAddBill = async (values: BillFormValues) => {
    try {
      setIsSubmitLoading(true);
      const res = await billService.createBill(values);
      if (res.success && res.data) {
        setItems([res.data, ...items]);
        toast.success('Bill registered successfully!');
        reset();
      } else {
        toast.error(res.message || 'Failed to register bill');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleTogglePay = async (id: number, currentPaid: boolean) => {
    try {
      const res = await billService.updateBill(id, { is_paid: !currentPaid });
      if (res.success && res.data) {
        setItems(items.map((item) => (item.id === id ? res.data! : item)));
        toast.success(!currentPaid ? 'Bill marked as Paid! 🎉' : 'Bill marked as Unpaid');
      } else {
        toast.error(res.message || 'Failed to update pay status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const res = await billService.deleteBill(deleteItem.id);
      if (res.success) {
        setItems(items.filter((item) => item.id !== deleteItem.id));
        toast.success('Bill deleted successfully!');
      } else {
        toast.error(res.message || 'Failed to delete bill');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    } finally {
      setDeleteItem(null);
    }
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

  const getStatusBadge = (item: BillItem) => {
    if (item.status === 'Paid') {
      return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">🟢 Paid</span>;
    }
    if (item.status === 'Overdue') {
      return <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">🔴 Overdue</span>;
    }
    return <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">🔵 Pending</span>;
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
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">⚡ Bills Manager</h1>
              <p className="text-slate-500 text-sm mt-1">Track family utility payments and set alerts before due dates.</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unpaid Bills</p>
                <p className="text-base font-extrabold text-secondary">
                  {items.filter((i) => i.status !== 'Paid').length} bills
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-secondary text-base">➕ Register Bill</h3>
              
              <form onSubmit={handleSubmit(handleAddBill)} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-xs font-semibold text-slate-500 mb-1">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Internet Bill"
                    {...register('title')}
                    className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                      errors.title ? 'border-error/50 focus:border-error' : 'border-slate-200'
                    }`}
                  />
                  {errors.title && <span className="text-[10px] font-bold text-error mt-1">{errors.title.message as string}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="amount" className="text-xs font-semibold text-slate-500 mb-1">Amount (₹)</label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount')}
                    className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
                      errors.amount ? 'border-error/50 focus:border-error' : 'border-slate-200'
                    }`}
                  />
                  {errors.amount && <span className="text-[10px] font-bold text-error mt-1">{errors.amount.message as string}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="category" className="text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <select
                      id="category"
                      {...register('category')}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                    >
                      {BILL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="due_date" className="text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                    <input
                      id="due_date"
                      type="date"
                      {...register('due_date')}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm text-sm disabled:opacity-50 mt-2"
                >
                  {isSubmitLoading ? 'Saving...' : 'Register Bill'}
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-8 space-y-4">
              {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-xs font-semibold">⚠️ {error}</div>}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Loading bills list...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl">🧾</span>
                  <p className="font-bold text-secondary text-sm">No registered bills</p>
                  <p className="text-xs max-w-xs mx-auto">Add your upcoming and monthly bills to trace deadlines and payouts.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        item.status === 'Overdue' ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Toggle Check Icon */}
                        <button
                          onClick={() => handleTogglePay(item.id, item.is_paid)}
                          className={`p-1 rounded-full transition-all focus:outline-none ${
                            item.is_paid ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-primary'
                          }`}
                        >
                          {item.is_paid ? <FiCheckCircle size={22} /> : <FiCircle size={22} />}
                        </button>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-secondary text-sm md:text-base ${item.is_paid ? 'line-through text-slate-400' : ''}`}>
                              {item.title}
                            </h4>
                            {getStatusBadge(item)}
                          </div>
                          <p className="text-xs text-slate-400">
                            Due on {formatDate(item.due_date)} {item.status === 'Pending' && `(in ${(new Date(item.due_date).getTime() - new Date().setHours(0,0,0,0)) / (1000*60*60*24)} days)`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <span className="text-lg md:text-xl font-extrabold text-secondary">
                          ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                <h4 className="font-bold text-secondary text-base">Delete Bill?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove the bill record for <strong>"{deleteItem.title}"</strong>?
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

export default Bills;
