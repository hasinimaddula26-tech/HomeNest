import React from 'react';
import { FiCheckSquare, FiSquare, FiTrash2 } from 'react-icons/fi';

export interface GroceryItem {
  id: number;
  item_name: string;
  quantity: number;
  unit: string;
  category: string;
  is_completed: boolean;
  created_at: string;
}

interface GroceryCardProps {
  item: GroceryItem;
  onToggle: (id: number, isCompleted: boolean) => void;
  onDeleteRequest: (item: GroceryItem) => void;
}

const categoryEmojis: Record<string, string> = {
  Vegetables: '🥦',
  Fruits: '🍎',
  Dairy: '🥛',
  Cleaning: '🧹',
  Medicine: '💊',
  Snacks: '🍿',
  Others: '📦',
};

const GroceryCard: React.FC<GroceryCardProps> = ({ item, onToggle, onDeleteRequest }) => {
  return (
    <div
      className={`group flex items-center justify-between bg-white border rounded-xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 ${
        item.is_completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggle(item.id, !item.is_completed)}
          className="text-slate-400 hover:text-primary transition-colors shrink-0"
        >
          {item.is_completed ? (
            <FiCheckSquare className="text-emerald-500" size={20} />
          ) : (
            <FiSquare size={20} />
          )}
        </button>

        {/* Text Details */}
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              item.is_completed ? 'text-slate-400 line-through' : 'text-secondary'
            }`}
          >
            {categoryEmojis[item.category] || '📦'} {item.item_name}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Qty: {item.quantity} {item.unit}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Category Badge */}
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
          {item.category}
        </span>

        {/* Delete button (visible on hover) */}
        <button
          onClick={() => onDeleteRequest(item)}
          className="text-slate-400 hover:text-error p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
          title="Delete item"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default GroceryCard;
