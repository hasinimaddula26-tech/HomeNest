import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HorizontalCalendar from '../../components/calendar/HorizontalCalendar';
import { ROUTES } from '../../constants/routes';
import { CATEGORIES as EXPENSE_CATEGORIES } from '../../constants/expense';
import * as dashboardService from '../../services/api/dashboardService';
import * as reminderService from '../../services/api/reminderService';
import { type DashboardMetricsData, type DashboardBillItem, type DashboardNotificationItem, type DashboardActivityItem } from '../../services/api/dashboardService';
import { type ExpenseItem } from '../../services/api/expenseService';
import { type ReminderItem } from '../../services/api/reminderService';
import { FiTrendingUp, FiShoppingBag, FiCheckSquare, FiAlertCircle, FiArrowRight, FiActivity, FiClock, FiPlusCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsData>({
    expenses_month: 0,
    expenses_trend: 0,
    groceries_completed: 0,
    groceries_total: 0,
    pending_bills_count: 0,
    active_reminders_count: 0,
  });

  const [upcomingBills, setUpcomingBills] = useState<DashboardBillItem[]>([]);
  const [todayReminders, setTodayReminders] = useState<ReminderItem[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseItem[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotificationItem[]>([]);
  const [activities, setActivities] = useState<DashboardActivityItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [metricsRes, billsRes, remindersRes, expensesRes, notifsRes, activitiesRes] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getUpcomingBills(),
        dashboardService.getTodayReminders(),
        dashboardService.getRecentExpenses(),
        dashboardService.getNotifications(),
        dashboardService.getRecentActivity(),
      ]);

      if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
      if (billsRes.success && billsRes.data) setUpcomingBills(billsRes.data);
      if (remindersRes.success && remindersRes.data) setTodayReminders(remindersRes.data);
      if (expensesRes.success && expensesRes.data) setRecentExpenses(expensesRes.data);
      if (notifsRes.success && notifsRes.data) setNotifications(notifsRes.data);
      if (activitiesRes.success && activitiesRes.data) setActivities(activitiesRes.data);

    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleReminder = async (id: number, currentCompleted: boolean) => {
    try {
      const res = await reminderService.updateReminder(id, { is_completed: !currentCompleted });
      if (res.success && res.data) {
        setTodayReminders(todayReminders.map(r => r.id === id ? res.data! : r));
        toast.success(!currentCompleted ? 'Reminder completed! 🎉' : 'Reminder active');
        // Refresh metrics and activity
        const [mRes, aRes] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getRecentActivity(),
        ]);
        if (mRes.success && mRes.data) setMetrics(mRes.data);
        if (aRes.success && aRes.data) setActivities(aRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred');
    }
  };

  const getExpenseEmoji = (category: string) => {
    return EXPENSE_CATEGORIES.find(c => c.value === category)?.emoji || '📦';
  };

  const formatActivityDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">Good Evening, Hasini 👋</h1>
              <p className="text-slate-500 text-sm mt-1">Here is a smart snapshot of your digital home command center.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={ROUTES.GROCERIES}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-2xs flex items-center gap-2"
              >
                <FiPlusCircle size={15} /> Add Grocery
              </Link>
              <Link
                to={ROUTES.EXPENSES}
                className="bg-primary hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <FiPlusCircle size={15} /> Log Expense
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-3">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Syncing smart household dashboard...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Expenses Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses (This Month)</span>
                    <FiTrendingUp className="text-emerald-500" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold text-secondary mt-2">
                    ₹{metrics.expenses_month.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                    <span>↑ {metrics.expenses_trend}%</span>
                    <span className="text-slate-400 font-medium">Compared to last month</span>
                  </p>
                </div>

                {/* Groceries Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Groceries shopping</span>
                    <FiShoppingBag className="text-blue-500" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold text-secondary mt-2">
                    {metrics.groceries_completed} / {metrics.groceries_total}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    Grocery checklist items completed
                  </p>
                </div>

                {/* Bills Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unpaid Bills</span>
                    <FiAlertCircle className="text-rose-500" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold text-secondary mt-2">
                    {metrics.pending_bills_count}
                  </p>
                  <p className="text-[10px] text-rose-500 font-bold mt-1">
                    Pending due dates
                  </p>
                </div>

                {/* Reminders Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Reminders</span>
                    <FiCheckSquare className="text-indigo-500" size={18} />
                  </div>
                  <p className="text-2xl font-extrabold text-secondary mt-2">
                    {metrics.active_reminders_count}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    Total tasks set for household
                  </p>
                </div>
              </div>

              {/* Layout Rows */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Column 1: Bills & Reminders (Left: 8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Row 1: Upcoming Bills & Today's Reminders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upcoming Bills Widget */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-secondary text-sm">📅 Upcoming Bills</h3>
                        <Link to="/bills" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                          View All <FiArrowRight />
                        </Link>
                      </div>

                      {upcomingBills.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No unpaid bills. Excellent!</p>
                      ) : (
                        <div className="space-y-3">
                          {upcomingBills.map((b) => (
                            <div key={b.id} className="flex items-center justify-between text-xs font-semibold">
                              <div>
                                <p className="text-secondary">{b.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Due {formatShortDate(b.due_date)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-secondary">₹{b.amount}</p>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block ${
                                  b.status === 'Overdue' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {b.status === 'Overdue' ? 'Overdue 🔴' : `Due in ${b.due_in_days}d`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Today's Reminders Widget */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-secondary text-sm">✓ Today's Reminders</h3>
                        <Link to="/reminders" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                          View All <FiArrowRight />
                        </Link>
                      </div>

                      {todayReminders.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No reminders scheduled for today.</p>
                      ) : (
                        <div className="space-y-3">
                          {todayReminders.map((r) => (
                            <div key={r.id} className="flex items-center justify-between text-xs font-semibold">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={r.is_completed}
                                  onChange={() => handleToggleReminder(r.id, r.is_completed)}
                                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 shrink-0"
                                />
                                <span className={r.is_completed ? 'line-through text-slate-400' : 'text-secondary'}>
                                  {r.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md">
                                {r.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Recent Expenses & Recent Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Expenses Widget */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-secondary text-sm">🛍️ Recent Expenses</h3>
                        <Link to={ROUTES.EXPENSES} className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                          View All <FiArrowRight />
                        </Link>
                      </div>

                      {recentExpenses.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No expenses logged yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {recentExpenses.map((exp) => (
                            <div key={exp.id} className="flex items-center justify-between text-xs font-semibold">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{getExpenseEmoji(exp.category)}</span>
                                <div>
                                  <p className="text-secondary">{exp.title}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{formatShortDate(exp.date)}</p>
                                </div>
                              </div>
                              <span className="text-secondary font-bold">₹{exp.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <FiActivity className="text-primary" size={16} />
                        <h3 className="font-bold text-secondary text-sm">Recent Activity</h3>
                      </div>

                      {activities.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No activity logged yet.</p>
                      ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                          {activities.map((act) => (
                            <div key={act.id} className="flex items-start justify-between gap-4 text-xs font-medium border-l-2 border-slate-100 pl-3">
                              <p className="text-slate-600 leading-normal">{act.description}</p>
                              <span className="text-[10px] text-slate-400 font-bold shrink-0 flex items-center gap-1">
                                <FiClock size={10} /> {formatActivityDate(act.created_at)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Calendar & Notifications (Right: 4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Calendar strip */}
                  <HorizontalCalendar bills={upcomingBills} reminders={todayReminders} />

                  {/* Dynamic priority notifications list */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                    <h3 className="font-bold text-secondary text-sm border-b border-slate-100 pb-3">🔔 Active Alerts</h3>
                    
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-8 text-center">All caught up! No notifications.</p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600 font-semibold"
                          >
                            <span className="text-base shrink-0 mt-0.5">
                              {notif.priority === 'high' ? '🔴' : notif.priority === 'medium' ? '🟠' : '🔵'}
                            </span>
                            <p className="leading-relaxed">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
