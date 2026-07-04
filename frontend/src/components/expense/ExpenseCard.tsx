import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { CATEGORIES } from '../../constants/expense';
import { type ExpenseItem } from '../../services/api/expenseService';

interface ExpenseCardProps {
  item: ExpenseItem;
  onDeleteRequest: (item: ExpenseItem) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ item, onDeleteRequest }) => {
  const categoryObj = CATEGORIES.find((c) => c.value === item.category);
  const emoji = categoryObj ? categoryObj.emoji : '📦';
  const label = categoryObj ? categoryObj.label : item.category;

  // Format date to local readable format e.g. "12 July 2026"
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Category Emoji Badge */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0 border border-slate-100">
          {emoji}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-secondary text-sm md:text-base">{item.title}</h4>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
              {label}
            </span>
          </div>
          <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
          {item.notes && <p className="text-xs text-slate-500 mt-1.5 italic">"{item.notes}"</p>}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
        <span className="text-lg md:text-xl font-extrabold text-secondary">
          ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
        <button
          onClick={() => onDeleteRequest(item)}
          className="text-slate-400 hover:text-error hover:bg-rose-50 p-2 rounded-xl transition-all duration-200"
          aria-label="Delete expense"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
