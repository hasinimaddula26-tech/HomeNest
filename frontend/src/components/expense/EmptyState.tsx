import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
      <span className="text-4xl" role="img" aria-label="money">
        💸
      </span>
      <h4 className="font-bold text-secondary text-sm md:text-base">No expenses added yet</h4>
      <p className="text-xs text-slate-500 max-w-xs">
        Start tracking your household and personal spending by adding your first expense above.
      </p>
    </div>
  );
};

export default EmptyState;
