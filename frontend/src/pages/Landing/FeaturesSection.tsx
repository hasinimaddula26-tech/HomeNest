import React from 'react';
import { IconType } from 'react-icons';
import { FiShoppingCart, FiDollarSign, FiFileText, FiFolder, FiClock, FiUsers } from 'react-icons/fi';

interface Feature {
  icon: IconType;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
}

const features: Feature[] = [
  {
    icon: FiShoppingCart,
    title: 'Grocery Planner',
    description: 'Create shared shopping lists, edit items in real-time, and mark them as purchased so nobody buys milk twice.',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
  },
  {
    icon: FiDollarSign,
    title: 'Expense Tracker',
    description: 'Log daily expenditures across categories (shopping, fuel, utilities) and view daily, weekly, and monthly calculations.',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
  },
  {
    icon: FiFileText,
    title: 'Bills Reminder',
    description: 'Save recurring payments (water, internet, gas) along with due dates and payment status to avoid missing deadlines.',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
  },
  {
    icon: FiFolder,
    title: 'Document Vault',
    description: 'Upload crucial records like driver licenses, property deeds, and energy bills for instant secure retrieval.',
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
  },
  {
    icon: FiClock,
    title: 'Smart Reminders',
    description: 'Set reminders for birthdays, medical checkups, insurance renewals, and EMIs with simple alerts.',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
  },
  {
    icon: FiUsers,
    title: 'Family Directory',
    description: 'Maintain details of all members including contact numbers, blood groups, birth dates, and relation statuses.',
    colorClass: 'text-violet-600',
    bgClass: 'bg-violet-50',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary mb-4">
            Everything you need, in one command center
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            Say goodbye to scattered notes and lost files. Explore the powerful modules we built to keep your family organized.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {/* Icon Wrapper */}
                <div
                  className={`w-12 h-12 rounded-xl ${feat.bgClass} ${feat.colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-out`}
                >
                  <IconComponent size={22} className="group-hover:rotate-6 transition-transform duration-300" />
                </div>

                <h3 className="text-lg font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-200">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
