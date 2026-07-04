import React from 'react';
import { FiTrendingUp, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';
import { type ExpenseSummaryData } from '../../services/api/expenseService';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryData;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ summary }) => {
  const cards = [
    {
      label: "Today's Spending",
      value: summary.today,
      icon: FiClock,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Weekly Spending',
      value: summary.week,
      icon: FiCalendar,
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      label: 'Monthly Spending',
      value: summary.month,
      icon: FiTrendingUp,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'Total Expenses',
      value: summary.total,
      icon: FiDollarSign,
      bg: 'bg-indigo-50',
      text: 'text-indigo-650',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.text} flex items-center justify-center shrink-0`}>
              <IconComponent size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-lg md:text-xl font-extrabold text-secondary mt-0.5">
                ₹{Number(card.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseSummary;
