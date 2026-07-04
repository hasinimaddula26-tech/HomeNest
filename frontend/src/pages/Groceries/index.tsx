import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
// We will import subcomponents in later steps. We can use a simple placeholder layout for now.

const Groceries: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">🛒 Grocery List</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your family shopping list in real-time.</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center">
            <span className="text-4xl mb-4 block">🥛</span>
            <h2 className="text-lg font-bold text-secondary mb-2">Groceries Shell</h2>
            <p className="text-slate-500 text-sm">Components will be loaded here in the next steps.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Groceries;
