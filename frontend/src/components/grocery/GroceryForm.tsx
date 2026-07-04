import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CATEGORIES } from '../../constants/grocery';

const grocerySchema = z.object({
  item_name: z.string()
    .min(2, 'Item name must be at least 2 characters')
    .max(100, 'Item name must be under 100 characters'),
  quantity: z.coerce.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be under 20 characters'),
  category: z.string()
    .min(1, 'Category is required'),
});

export type GroceryFormValues = z.infer<typeof grocerySchema>;

interface GroceryFormProps {
  onSubmit: (values: GroceryFormValues) => void;
  isLoading: boolean;
}

const GroceryForm: React.FC<GroceryFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(grocerySchema),
    defaultValues: {
      item_name: '',
      quantity: 1,
      unit: 'Pcs',
      category: 'Others',
    },
  });

  const handleFormSubmit = (data: GroceryFormValues) => {
    onSubmit(data);
    reset(); // Reset form after submit
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4"
    >
      <h3 className="font-bold text-secondary text-base mb-2">➕ Add Grocery Item</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Item Name */}
        <div className="md:col-span-5 flex flex-col">
          <label htmlFor="item_name" className="text-xs font-semibold text-slate-500 mb-1.5">
            Item Name
          </label>
          <input
            id="item_name"
            type="text"
            placeholder="e.g. Fresh Milk"
            {...register('item_name')}
            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
              errors.item_name ? 'border-error/50 focus:border-error' : 'border-slate-200'
            }`}
          />
          {errors.item_name && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.item_name.message as string}</span>
          )}
        </div>

        {/* Quantity */}
        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="quantity" className="text-xs font-semibold text-slate-500 mb-1.5">
            Qty
          </label>
          <input
            id="quantity"
            type="number"
            {...register('quantity')}
            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
              errors.quantity ? 'border-error/50 focus:border-error' : 'border-slate-200'
            }`}
          />
          {errors.quantity && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.quantity.message as string}</span>
          )}
        </div>

        {/* Unit */}
        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="unit" className="text-xs font-semibold text-slate-500 mb-1.5">
            Unit
          </label>
          <input
            id="unit"
            type="text"
            placeholder="e.g. Liters, Pcs"
            {...register('unit')}
            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
              errors.unit ? 'border-error/50 focus:border-error' : 'border-slate-200'
            }`}
          />
          {errors.unit && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.unit.message as string}</span>
          )}
        </div>

        {/* Category */}
        <div className="md:col-span-3 flex flex-col">
          <label htmlFor="category" className="text-xs font-semibold text-slate-500 mb-1.5">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
              errors.category ? 'border-error/50 focus:border-error' : 'border-slate-200'
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.category.message as string}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:scale-100 flex items-center justify-center text-sm"
        >
          {isLoading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default GroceryForm;
