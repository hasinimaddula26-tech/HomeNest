import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { type GroceryItem } from './GroceryCard';

interface DeleteConfirmationModalProps {
  item: GroceryItem | null;
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-500 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <FiAlertTriangle size={20} />
          </div>
          <h3 className="font-bold text-secondary text-base">Delete Item</h3>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-secondary">"{item.item_name}"</span>? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-error hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
