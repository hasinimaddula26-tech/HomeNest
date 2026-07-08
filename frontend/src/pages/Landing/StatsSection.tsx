import React from 'react';

interface StatItem {
  value: string;
  label: string;
  description: string;
  icon: string;
}

const stats: StatItem[] = [
  { value: '50+', label: 'Tasks Managed', description: 'Daily tasks organized per family', icon: '✅' },
  { value: '100+', label: 'Bills Tracked', description: 'Recurring bills monitored', icon: '🧾' },
  { value: '500+', label: 'Documents Stored', description: 'Secure digital files uploaded', icon: '📂' },
  { value: '24/7', label: 'Availability', description: 'Access from anywhere, anytime', icon: '🌐' },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-slate-200/60">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-secondary flex items-baseline gap-1">
                <span className="text-primary">{stat.value}</span>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-sm font-bold text-slate-800 tracking-tight uppercase">
                {stat.label}
              </p>
              <p className="text-xs text-slate-500 max-w-[200px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
