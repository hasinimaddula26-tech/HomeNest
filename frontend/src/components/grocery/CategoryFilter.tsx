import React from 'react';
import { CATEGORIES } from '../../constants/grocery';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory('All')}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          selectedCategory === 'All'
            ? 'bg-primary border-primary text-white shadow-sm'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        All Items
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            selectedCategory === cat
              ? 'bg-primary border-primary text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
