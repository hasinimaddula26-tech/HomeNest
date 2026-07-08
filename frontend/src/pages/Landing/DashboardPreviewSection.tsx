import React, { useState } from 'react';
import { FiCheckSquare, FiSquare, FiPlus, FiTrendingUp, FiCreditCard, FiUsers, FiClock } from 'react-icons/fi';

interface Task {
  id: number;
  text: string;
  category: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 1, text: 'Pay Electricity Bill', category: 'Bills', completed: false },
  { id: 2, text: 'Buy Groceries (Milk, Rice, Eggs)', category: 'Grocery', completed: true },
  { id: 3, text: 'Schedule Water Filter Service', category: 'Maintenance', completed: false },
];

const DashboardPreviewSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      category: 'General',
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  return (
    <section id="dashboard-preview" className="py-20 md:py-28 bg-slate-50 border-y border-slate-200/50">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary mb-4">
            See the Dashboard in Action
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            Interact with our live mockup below. Try adding tasks or checking them off to see how easy it is to manage your home.
          </p>
        </div>

        {/* Dashboard Frame Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <span className="text-white font-extrabold tracking-tight text-base">HomeNest</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">Demo Workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Live Sync Enabled</span>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="p-6 md:p-8 bg-slate-50/50 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left/Middle Column (Lg: 8 cols): Tasks & Input */}
            <div className="lg:col-span-8 space-y-6">
              {/* Task Panel Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-secondary text-base flex items-center gap-2">
                    <FiCheckSquare className="text-primary" /> Today's Quick Tasks
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
                  </span>
                </div>

                {/* Task List */}
                <div className="space-y-3 mb-6">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        task.completed
                          ? 'bg-slate-50/80 border-slate-100/80 text-slate-400 line-through'
                          : 'bg-white border-slate-200/80 text-secondary hover:border-primary/30 hover:bg-blue-50/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <FiCheckSquare className="text-emerald-500 shrink-0" size={18} />
                        ) : (
                          <FiSquare className="text-slate-350 shrink-0" size={18} />
                        )}
                        <span className="text-sm font-medium">{task.text}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.completed
                            ? 'bg-slate-100 text-slate-400'
                            : task.category === 'Bills'
                            ? 'bg-rose-50 text-rose-600'
                            : task.category === 'Grocery'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-blue-50 text-primary'
                        }`}
                      >
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Task Form */}
                <form onSubmit={addTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new family task..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-700 text-white p-3 rounded-xl transition-all duration-200 shadow-sm shrink-0 flex items-center justify-center"
                  >
                    <FiPlus size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column (Lg: 4 cols): Overview Cards */}
            <div className="lg:col-span-4 space-y-6">
              {/* Expense Tracker Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses (This Month)</p>
                  <p className="text-2xl font-extrabold text-secondary mt-0.5">₹12,450</p>
                </div>
              </div>

              {/* Bills Alert Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <FiCreditCard size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Bills</p>
                  <p className="text-2xl font-extrabold text-secondary mt-0.5">3 <span className="text-xs text-slate-400 font-medium">Pending</span></p>
                </div>
              </div>

              {/* Family Members Count Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0">
                  <FiUsers size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Family Members</p>
                  <p className="text-2xl font-extrabold text-secondary mt-0.5">5 <span className="text-xs text-slate-400 font-medium">Synced</span></p>
                </div>
              </div>

              {/* Reminders Timer Badge */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Reminder</p>
                  <p className="text-sm font-bold text-secondary mt-0.5">Mom's Birthday 🎉</p>
                  <p className="text-[10px] text-slate-400 font-medium">In 2 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
