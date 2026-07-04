import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-800 p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to HomeNest</h1>
      <p className="text-slate-600 mb-6">Here is an overview of your digital home command center.</p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">Bills</h2>
          <p className="text-sm text-slate-400">Placeholder for bills overview</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">Expenses</h2>
          <p className="text-sm text-slate-400">Placeholder for expenses tracker</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">Groceries</h2>
          <p className="text-sm text-slate-400">Placeholder for grocery list</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
