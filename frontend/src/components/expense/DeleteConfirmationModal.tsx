import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { type ExpenseItem } from '../../services/api/expenseService';

interface DeleteConfirmationModalProps {
  item: ExpenseItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  item,
  onConfirm,
  onCancel,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-secondary text-base">Delete Expense?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete the expense for <strong>"{item.title}"</strong> (₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}). This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-error hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
