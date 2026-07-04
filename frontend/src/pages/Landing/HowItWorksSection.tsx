import React from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Sign up securely as a family. One account lets everyone in your home sync their access and share updates.',
    icon: '👤',
  },
  {
    number: '02',
    title: 'Add Your Information',
    description: 'Input grocery items, upcoming utility invoices, critical contact numbers, and important family files.',
    icon: '➕',
  },
  {
    number: '03',
    title: 'Manage Everything Easily',
    description: 'Access updates, monitor family schedules, and receive notifications—all from your centralized dashboard.',
    icon: '🎯',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary mb-4">
            Getting started in 3 simple steps
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            HomeNest is built to be simple and intuitive. You do not need to be a tech expert to organize your home.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              {/* Step Circle */}
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl font-bold text-slate-400 group-hover:border-primary group-hover:text-primary transition-all duration-300 relative bg-white z-10">
                <span className="group-hover:scale-115 transition-transform duration-300">{step.icon}</span>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center group-hover:bg-primary transition-colors">
                  {step.number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-secondary mt-6 mb-3 group-hover:text-primary transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
