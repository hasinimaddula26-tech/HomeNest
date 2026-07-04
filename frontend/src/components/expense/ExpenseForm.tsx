import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CATEGORIES } from '../../constants/expense';

const expenseSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be under 100 characters')
    .refine((val) => !/^\d+$/.test(val.trim()), {
      message: 'Title cannot consist of numbers only',
    }),
  amount: z.coerce.number()
    .min(0.01, 'Amount must be at least ₹0.01'),
  category: z.string().min(1, 'Category is required'),
  date: z.string()
    .min(1, 'Date is required')
    .refine((val) => {
      const selectedDate = new Date(val);
      // Strip time parts for calendar day comparison
      selectedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, {
      message: 'Date cannot be in the future',
    }),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSubmit: (values: ExpenseFormValues) => void;
  isLoading: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, isLoading }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: 'Others',
      date: todayStr,
      notes: '',
    },
  });

  const handleFormSubmit = (data: ExpenseFormValues) => {
    onSubmit(data);
    reset({
      title: '',
      amount: '',
      category: 'Others',
      date: todayStr,
      notes: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4"
    >
      <h3 className="font-bold text-secondary text-base mb-2">💸 Add Expense</h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Title */}
        <div className="md:col-span-4 flex flex-col">
          <label htmlFor="title" className="text-xs font-semibold text-slate-500 mb-1.5">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Vegetables, Rent"
            {...register('title')}
            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
              errors.title ? 'border-error/50 focus:border-error' : 'border-slate-200'
            }`}
          />
          {errors.title && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.title.message as string}</span>
          )}
        </div>

        {/* Amount */}
        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="amount" className="text-xs font-semibold text-slate-500 mb-1.5">
            Amount (₹)
          </label>
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
          {errors.amount && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.amount.message as string}</span>
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
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.category.message as string}</span>
          )}
        </div>

        {/* Date */}
        <div className="md:col-span-3 flex flex-col">
          <label htmlFor="date" className="text-xs font-semibold text-slate-500 mb-1.5">
            Date
          </label>
          <input
            id="date"
            type="date"
            max={todayStr}
            {...register('date')}
            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
              errors.date ? 'border-error/50 focus:border-error' : 'border-slate-200'
            }`}
          />
          {errors.date && (
            <span className="text-[10px] font-bold text-error mt-1">{errors.date.message as string}</span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col">
        <label htmlFor="notes" className="text-xs font-semibold text-slate-500 mb-1.5">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={2}
          placeholder="Add extra details..."
          {...register('notes')}
          className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ${
            errors.notes ? 'border-error/50 focus:border-error' : 'border-slate-200'
          }`}
        />
        {errors.notes && (
          <span className="text-[10px] font-bold text-error mt-1">{errors.notes.message as string}</span>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:scale-100 flex items-center justify-center text-sm"
        >
          {isLoading ? 'Adding...' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
