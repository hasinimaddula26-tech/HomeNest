import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-4'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-xl font-bold text-secondary tracking-tight">
          <span className="text-2xl">🏠</span>
          <span>HomeNest</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            Testimonials
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="bg-primary hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-600 hover:text-secondary focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg px-6 py-6 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="flex flex-col gap-4">
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
          >
            Testimonials
          </a>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-medium text-slate-600 hover:text-primary py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-primary hover:bg-blue-700 text-white text-center font-medium py-3 rounded-xl shadow-sm transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
