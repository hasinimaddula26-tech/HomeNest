import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ExpenseForm, { type ExpenseFormValues } from '../../components/expense/ExpenseForm';
import ExpenseList from '../../components/expense/ExpenseList';
import ExpenseSummary from '../../components/expense/ExpenseSummary';
import DeleteConfirmationModal from '../../components/expense/DeleteConfirmationModal';
import { CATEGORIES } from '../../constants/expense';
import * as expenseService from '../../services/api/expenseService';
import { type ExpenseItem, type ExpenseSummaryData } from '../../services/api/expenseService';

const Expenses: React.FC = () => {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [summary, setSummary] = useState<ExpenseSummaryData>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<ExpenseItem | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [expensesRes, summaryRes] = await Promise.all([
        expenseService.getExpenses(),
        expenseService.getExpensesSummary(),
      ]);

      if (expensesRes.success && expensesRes.data) {
        setItems(expensesRes.data);
      } else {
        setError(expensesRes.message || 'Failed to fetch expense items');
      }

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSummary = async () => {
    try {
      const summaryRes = await expenseService.getExpensesSummary();
      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (values: ExpenseFormValues) => {
    try {
      setIsSubmitLoading(true);
      const res = await expenseService.createExpense(values);
      if (res.success && res.data) {
        setItems([res.data, ...items]);
        toast.success('Expense logged successfully!');
        refreshSummary();
      } else {
        toast.error(res.message || 'Failed to log expense');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to log expense due to connection error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const res = await expenseService.deleteExpense(deleteItem.id);
      if (res.success) {
        setItems(items.filter((item) => item.id !== deleteItem.id));
        toast.success('Expense deleted successfully!');
        refreshSummary();
      } else {
        toast.error(res.message || 'Failed to delete expense');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete expense due to connection error');
    } finally {
      setDeleteItem(null);
    }
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id;
    }
    if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id;
    }
    if (sortBy === 'highest') {
      return b.amount - a.amount;
    }
    if (sortBy === 'lowest') {
      return a.amount - b.amount;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">💰 Expense Tracker</h1>
              <p className="text-slate-500 text-sm mt-1">Track family budgets and monthly spending summary.</p>
            </div>
          </div>

          {/* Loading summary state fallback */}
          <ExpenseSummary summary={summary} />

          {/* Form and List Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (Left: 4 cols) */}
            <div className="lg:col-span-4">
              <ExpenseForm onSubmit={handleAddExpense} isLoading={isSubmitLoading} />
            </div>

            {/* List Column (Right: 8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Search, Filter, Sort Controls Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Search */}
                  <div className="flex flex-col">
                    <label htmlFor="search" className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Search Expenses
                    </label>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search title or notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:bg-white focus:border-primary transition-all placeholder-slate-400"
                    />
                  </div>

                  {/* Sort */}
                  <div className="flex flex-col">
                    <label htmlFor="sort" className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Sort By
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:bg-white focus:border-primary transition-all text-slate-600"
                    >
                      <option value="newest">🗓️ Newest First</option>
                      <option value="oldest">🗓️ Oldest First</option>
                      <option value="highest">📈 Highest Amount</option>
                      <option value="lowest">📉 Lowest Amount</option>
                    </select>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Category Filter</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedCategory === 'All'
                          ? 'bg-primary border-primary text-white shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 ${
                          selectedCategory === cat.value
                            ? 'bg-primary border-primary text-white shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}

              {/* List */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium">Loading expenses...</p>
                </div>
              ) : (
                <ExpenseList
                  items={sortedItems}
                  onDeleteRequest={setDeleteItem}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <DeleteConfirmationModal
        item={deleteItem}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />

      <Footer />
    </div>
  );
};

export default Expenses;
