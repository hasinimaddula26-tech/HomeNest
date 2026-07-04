import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Text & Buttons */}
        <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-primary mb-6 border border-blue-100 shadow-2xs">
            ✨ Introducing HomeNest 1.0
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-secondary leading-[1.1] mb-6">
            Manage Your Entire Home <br className="hidden md:inline" />
            <span className="text-primary">From One Dashboard</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
            Track groceries, expenses, bills, family documents, maintenance, and reminders—all in one secure place. Built for modern families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to={ROUTES.REGISTER}
              className="bg-primary hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg text-center"
            >
              Get Started
            </Link>
            <a
              href="#dashboard-preview"
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-8 py-3.5 rounded-xl border border-slate-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-2xs text-center"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Right Column: Floating Mockup Graphic */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square flex justify-center items-center animate-float">
            {/* Main Mockup Card */}
            <div className="w-[85%] bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-6 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-400">🏠 homenest.app</span>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-100 rounded-md w-2/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded-md w-full" />
                  <div className="h-4 bg-slate-100 rounded-md w-5/6" />
                </div>
                {/* Visual Accent Box */}
                <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-4 flex justify-between items-center mt-6">
                  <div className="space-y-1.5 w-full">
                    <div className="h-4 bg-blue-200 rounded-md w-1/3" />
                    <div className="h-3 bg-blue-150 rounded-md w-2/3" />
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>

            {/* Extra Floating Mini Badge 1 */}
            <div className="absolute -top-4 -left-2 bg-white border border-slate-150 rounded-xl shadow-lg p-3 flex items-center gap-3 animate-pulse duration-3000">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-lg">
                🛒
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Grocery list updated</p>
                <p className="text-xs font-bold text-slate-700">Milk, Eggs, Rice</p>
              </div>
            </div>

            {/* Extra Floating Mini Badge 2 */}
            <div className="absolute bottom-6 -right-4 bg-white border border-slate-150 rounded-xl shadow-lg p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-lg">
                🧾
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Upcoming Bill</p>
                <p className="text-xs font-bold text-slate-700">Electricity due in 3d</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
