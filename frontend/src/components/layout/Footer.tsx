import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 md:py-16 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding & Logo */}
        <div className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
          <span className="text-xl">🏠</span>
          <span>HomeNest</span>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400 font-medium">
          <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
            Home
          </Link>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-500 font-medium">
          &copy; {currentYear} HomeNest. All rights reserved. Demo app context.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
