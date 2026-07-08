import React from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

interface AppItem {
  icon: string;
  name: string;
  issue: string;
}

const scatteredApps: AppItem[] = [
  { icon: '💬', name: 'WhatsApp', issue: 'Scattered grocery list messages' },
  { icon: '📝', name: 'Notes App', issue: 'Reminders that get lost or forgotten' },
  { icon: '🖼️', name: 'Photo Gallery', issue: 'Screenshots of receipts and bills' },
  { icon: '📧', name: 'Email Inbox', issue: 'Utility invoice PDFs buried deep' },
  { icon: '☁️', name: 'Google Drive', issue: 'Disorganized insurance/ID files' },
];

const ProblemSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/50">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary mb-4">
            Still managing your home with five different apps?
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            Scattered information wastes time and creates unnecessary stress. HomeNest consolidates it all.
          </p>
        </div>

        {/* Visual Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
          {/* Left Side: Scattered Apps */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center lg:text-left mb-6">
              The Scattered Reality
            </h3>
            {scatteredApps.map((app, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all duration-200"
              >
                <span className="text-2xl">{app.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-secondary text-sm">{app.name}</h4>
                  <p className="text-xs text-slate-500">{app.issue}</p>
                </div>
                <span className="text-xs font-bold text-rose-500 bg-rose-55/60 px-2 py-1 rounded-md">
                  Chaotic
                </span>
              </div>
            ))}
          </div>

          {/* Middle Connection: Arrow */}
          <div className="lg:col-span-1 flex justify-center py-4 lg:py-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-xs rotate-90 lg:rotate-0">
              <FiArrowRight size={20} className="animate-pulse" />
            </div>
          </div>

          {/* Right Side: The HomeNest Solution */}
          <div className="lg:col-span-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center lg:text-left mb-6">
              The Unified Solution
            </h3>
            <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Highlight background accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏠</span>
                <div>
                  <h4 className="font-extrabold text-secondary text-lg">HomeNest</h4>
                  <p className="text-xs text-primary font-semibold">Your Digital Command Center</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FiCheck size={12} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-secondary">One Dashboard</h5>
                    <p className="text-xs text-slate-500">Every module (bills, groceries, reminders) fits in one view.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FiCheck size={12} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-secondary">Family Collaboration</h5>
                    <p className="text-xs text-slate-500">Shared lists allow every member to contribute in real-time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FiCheck size={12} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-secondary">Encrypted Documents</h5>
                    <p className="text-xs text-slate-500">Private, secure vault protects family identities and invoices.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-xs text-primary font-bold">
                  Everything organized in one secure platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
