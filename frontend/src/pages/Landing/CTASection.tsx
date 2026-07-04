import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle grid pattern or shapes */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 max-w-xl leading-tight">
              Ready to simplify your family management?
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Start using HomeNest today. Create a secure, central space for everyone in your household.
            </p>
            <Link
              to={ROUTES.REGISTER}
              className="bg-primary hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-center text-sm md:text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
