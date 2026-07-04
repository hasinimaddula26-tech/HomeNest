import React from 'react';
import { type DashboardBillItem } from '../../services/api/dashboardService';
import { type ReminderItem } from '../../services/api/reminderService';

interface HorizontalCalendarProps {
  bills: DashboardBillItem[];
  reminders: ReminderItem[];
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ bills, reminders }) => {
  const getDaysArray = () => {
    const days = [];
    const today = new Date();
    
    // Generate 7 days: 3 days ago, today, and 3 days ahead
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDaysArray();
  const todayStr = new Date().toDateString();

  const getDayEvents = (dateObj: Date) => {
    const dateISO = dateObj.toISOString().split('T')[0];
    
    const hasBill = bills.some(b => b.due_date === dateISO);
    const dayReminders = reminders.filter(r => r.date === dateISO && !r.is_completed);
    const hasBirthday = dayReminders.some(r => r.type === 'Birthday');
    const hasOtherReminder = dayReminders.some(r => r.type !== 'Birthday');

    return { hasBill, hasBirthday, hasOtherReminder };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-secondary text-sm">📅 Calendar Timeline</h3>
        <div className="flex gap-3 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1">🔴 <span className="uppercase">Bills</span></span>
          <span className="flex items-center gap-1">🟢 <span className="uppercase">Reminders</span></span>
          <span className="flex items-center gap-1">🟡 <span className="uppercase">Birthdays</span></span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const isToday = day.toDateString() === todayStr;
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = day.getDate();
          const { hasBill, hasBirthday, hasOtherReminder } = getDayEvents(day);

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                isToday
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-blue-100' : 'text-slate-400'}`}>
                {dayName}
              </span>
              <span className="text-base font-extrabold mt-1">{dayNum}</span>

              {/* Event indicators */}
              <div className="flex gap-0.5 mt-2 h-1.5 justify-center">
                {hasBill && <span className="w-1 h-1 rounded-full bg-rose-500" />}
                {hasOtherReminder && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                {hasBirthday && <span className="w-1 h-1 rounded-full bg-amber-500" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalCalendar;
