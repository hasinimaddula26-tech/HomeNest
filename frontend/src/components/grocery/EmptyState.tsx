import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-2xs text-center flex flex-col items-center">
      <span className="text-5xl mb-4 animate-bounce">🥛</span>
      <h3 className="text-base font-bold text-secondary mb-1">No groceries yet</h3>
      <p className="text-slate-400 text-xs max-w-xs">
        Your family shopping list is empty. Add your first grocery item above to get started!
      </p>
    </div>
  );
};

export default EmptyState;
