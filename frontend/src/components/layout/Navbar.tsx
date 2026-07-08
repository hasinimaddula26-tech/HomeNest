import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';
import { getNotifications, type DashboardNotificationItem } from '../../services/api/dashboardService';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<DashboardNotificationItem[]>([]);
  
  // Track read notification IDs in LocalStorage
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('homenest_read_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const notifRef = useRef<HTMLDivElement>(null);

  const isAppPage = location.pathname !== ROUTES.HOME && 
                    location.pathname !== ROUTES.LOGIN && 
                    location.pathname !== ROUTES.REGISTER;

  const fetchNotifs = async () => {
    if (!isAppPage) return;
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  // Fetch notifications periodically or on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotifs();
    }, 0);
    const interval = setInterval(fetchNotifs, 15000); // 15s polling
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Click outside listener for notification panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !readIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('homenest_read_notifications', JSON.stringify(allIds));
  };


  const getPriorityDot = (p: string) => {
    if (p === 'high') return '🔴';
    if (p === 'medium') return '🟠';
    return '🔵';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen || isAppPage
          ? 'bg-white shadow-sm border-b border-slate-200/50 py-4'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-xl font-bold text-secondary tracking-tight">
          <span className="text-2xl">🏠</span>
          <span>HomeNest</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {isAppPage ? (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === ROUTES.DASHBOARD ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to={ROUTES.GROCERIES}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === ROUTES.GROCERIES ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Groceries
              </Link>
              <Link
                to={ROUTES.EXPENSES}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === ROUTES.EXPENSES ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Expenses
              </Link>
              <Link
                to={ROUTES.BILLS || '/bills'}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === (ROUTES.BILLS || '/bills') ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Bills
              </Link>
              <Link
                to={ROUTES.REMINDERS || '/reminders'}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === (ROUTES.REMINDERS || '/reminders') ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Reminders
              </Link>
            </>
          ) : (
            <>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Testimonials
              </a>
            </>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isAppPage ? (
            <div className="relative" ref={notifRef}>
              {/* Bell Icon button */}
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="text-slate-600 hover:text-primary relative p-1.5 rounded-xl hover:bg-slate-50 transition-all focus:outline-none"
                aria-label="Notifications"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-250">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-secondary text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto mt-2">
                    {unreadCount === 0 ? (
                      <div className="py-6 px-4 text-center text-slate-400 space-y-1">
                        <p className="text-sm font-medium">🔔 All caught up!</p>
                        <p className="text-[10px]">No new notifications.</p>
                      </div>
                    ) : (
                      unreadNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-start gap-2.5 text-xs text-secondary font-medium leading-normal border-b border-slate-50 last:border-0"
                        >
                          <span className="shrink-0 text-sm mt-0.5">{getPriorityDot(notif.priority)}</span>
                          <div className="flex-grow">
                            <p>{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
          {isAppPage ? (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to={ROUTES.GROCERIES}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
              >
                Groceries
              </Link>
              <Link
                to={ROUTES.EXPENSES}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
              >
                Expenses
              </Link>
              <Link
                to={ROUTES.BILLS || '/bills'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
              >
                Bills
              </Link>
              <Link
                to={ROUTES.REMINDERS || '/reminders'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
              >
                Reminders
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
