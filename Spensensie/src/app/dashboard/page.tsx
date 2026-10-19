"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { 
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, 
  Sparkles, Plus, Edit2, Calendar, Target, Settings, User as UserIcon,
  HelpCircle, Lightbulb, Check, ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const { 
    user, updateProfile, transactions, addTransaction, goals, budgetLimits 
  } = useAppState();

  // Profile update form states
  const [profileOpen, setProfileOpen] = useState(false);
  const [profName, setProfName] = useState(user?.name || "");
  const [profEmail, setProfEmail] = useState(user?.email || "");
  const [profRole, setProfRole] = useState<"USER" | "ADMIN">(user?.role || "USER");
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Quick transaction add states
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [qaType, setQaType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [qaAmount, setQaAmount] = useState("");
  const [qaCategory, setQaCategory] = useState("Food & Grocery");
  const [qaNote, setQaNote] = useState("");

  // Update profile
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profName, profEmail, user?.avatar);
    setProfileUpdated(true);
    setTimeout(() => {
      setProfileUpdated(false);
      setProfileOpen(false);
    }, 2000);
  };

  // Quick transaction submit
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaAmount || Number(qaAmount) <= 0) return;

    addTransaction({
      type: qaType,
      amount: Number(qaAmount),
      category: qaCategory,
      date: new Date().toISOString().split("T")[0],
      note: qaNote.trim(),
      isRecurring: false
    });

    setQaAmount("");
    setQaNote("");
    setQuickAddOpen(false);
  };

  // 1. Calculations: KPIs
  const totalIncome = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // 2. Spending Pie Chart Data
  const pieChartData = React.useMemo(() => {
    const map: { [cat: string]: number } = {};
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    
    return Object.keys(map).map((cat) => ({
      name: cat,
      value: Math.round(map[cat])
    }));
  }, [transactions]);

  const COLORS = ["#10B981", "#84CC16", "#065F46", "#059669", "#A3E635", "#34D399", "#4D7C0F", "#64748B"];

  // 3. Cash Flow & Savings Trends
  const trendData = [
    { name: "Jan", Income: 4000, Expenses: 3200, Savings: 800 },
    { name: "Feb", Income: 4200, Expenses: 3100, Savings: 1100 },
    { name: "Mar", Income: 4200, Expenses: 3500, Savings: 700 },
    { name: "Apr", Income: 4500, Expenses: 3600, Savings: 900 },
    { name: "May", Income: 4600, Expenses: 3400, Savings: 1200 },
    { name: "Jun", Income: 4800, Expenses: 3800, Savings: 1000 },
    { name: "Jul", Income: totalIncome, Expenses: totalExpenses, Savings: netSavings }
  ];

  // 4. Smart Financial Insights
  const insights = React.useMemo(() => {
    const list = [];
    if (savingsRate > 30) {
      list.push({
        type: "success",
        title: "Excellent Savings Rate",
        text: `Your savings rate is ${savingsRate}%, well above the standard 20% benchmark. You are on track for accelerated wealth generation!`
      });
    } else if (savingsRate < 15) {
      list.push({
        type: "warning",
        title: "Savings Rate Ceiling Warning",
        text: `Your current monthly savings rate is ${savingsRate}%. Setting a grocery or dining out threshold could help route an extra $150 to goals.`
      });
    }

    // Check budget limit warnings
    const categorySpentMap: { [cat: string]: number } = {};
    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE") {
        categorySpentMap[tx.category] = (categorySpentMap[tx.category] || 0) + tx.amount;
      }
    });

    let limitAlertsCount = 0;
    budgetLimits.forEach((b) => {
      const spent = categorySpentMap[b.category] || 0;
      if (spent > b.limit) {
        limitAlertsCount++;
        list.push({
          type: "danger",
          title: `Over budget on ${b.category}`,
          text: `You have spent $${spent.toLocaleString()} on ${b.category}, exceeding your limit of $${b.limit.toLocaleString()} by $${(spent - b.limit).toLocaleString()}.`
        });
      }
    });

    if (limitAlertsCount === 0) {
      list.push({
        type: "info",
        title: "Category Budgets Intact",
        text: "Outstanding! All of your category budgets remain under their respective limits this month."
      });
    }

    if (goals.length > 0) {
      const closestGoal = goals[0];
      const progressPercent = Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100);
      if (progressPercent < 100) {
        list.push({
          type: "info",
          title: `Focus Goal: ${closestGoal.title}`,
          text: `You are at ${progressPercent}% of your target. An extra deposit of $120 this week will push you closer to your milestone!`
        });
      }
    }

    return list;
  }, [savingsRate, budgetLimits, transactions, goals]);

  // Categories list for quick add
  const categories = qaType === "INCOME" 
    ? ["Salary", "Freelance", "Business", "Rental income", "Investments", "Bonus", "Other income"]
    : ["Housing", "Utilities", "Internet & Phone", "Food & Grocery", "Dining Out", "Transportation", "Shopping", "Entertainment", "Savings", "Investments", "Debt Payments", "Miscellaneous"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                Welcome back, {user?.name || "Member"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Here is your financial sandbox update for July 2026.</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setProfileOpen(true)}
                className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-slate-655"
                title="Edit profile settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setQaType("EXPENSE");
                  setQaCategory("Food & Grocery");
                  setQuickAddOpen(true);
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-500/15"
              >
                <Plus className="w-4 h-4" />
                <span>Quick Transaction</span>
              </button>
            </div>
          </div>

          {/* KPI Dashboard Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1: Income */}
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <span className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-2xl">
                <ArrowUpRight className="w-6 h-6" />
              </span>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Monthly Income</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${totalIncome.toLocaleString()}</h3>
              </div>
            </div>

            {/* KPI 2: Expenses */}
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <span className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
                <ArrowDownRight className="w-6 h-6" />
              </span>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Monthly Expenses</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${totalExpenses.toLocaleString()}</h3>
              </div>
            </div>

            {/* KPI 3: Remaining Balance */}
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <span className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl">
                <Wallet className="w-6 h-6" />
              </span>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining Balance</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${netSavings.toLocaleString()}</h3>
              </div>
            </div>

            {/* KPI 4: Savings Rate */}
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <span className="p-3 bg-lime-500/10 text-lime-655 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </span>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monthly Savings Rate</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{savingsRate}%</h3>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Cash flow (Area Chart) */}
            <div className="lg:col-span-2 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display mb-4">Cash Flow History</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInc)" />
                    <Area type="monotone" dataKey="Expenses" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Spending by Category (Pie Chart) */}
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display mb-4">Expense Categories</h3>
              <div className="h-64 w-full flex items-center justify-center">
                {pieChartData.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No expenses cataloged yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend wrapperStyle={{ fontSize: 10 }} layout="horizontal" verticalAlign="bottom" align="center" iconSize={6} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>

          {/* Lower Grid: Recent ledger list vs AI insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Recent transactions */}
            <div className="lg:col-span-7 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-850">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                  Recent Ledger Transactions
                </h3>
                <Link
                  href="/budget"
                  className="text-xs font-bold text-brand-655 flex items-center hover:underline"
                >
                  <span>View All Ledger</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-3 truncate">
                      <span className={`p-1.5 rounded-lg ${
                        tx.type === "INCOME" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450" 
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}>
                        {tx.type === "INCOME" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      </span>
                      <div className="truncate">
                        <p className="text-slate-800 dark:text-slate-200 truncate">{tx.note || tx.category}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{tx.date}</p>
                      </div>
                    </div>
                    <span className={tx.type === "INCOME" ? "text-emerald-600 font-bold" : "text-slate-700 dark:text-slate-300 font-bold"}>
                      {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Financial Insights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display mb-4 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>AI Financial Insights</span>
                </h3>

                <div className="space-y-4">
                  {insights.map((insight, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                        insight.type === "success" 
                          ? "bg-emerald-500/10 border-brand-500/20 text-brand-700 dark:text-brand-400" 
                          : insight.type === "danger" 
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-450 font-bold" 
                            : insight.type === "warning"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-450"
                              : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <p className="font-bold mb-1 font-display">{insight.title}</p>
                      <p>{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* User Profile Settings Drawer Modal */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-150 rounded-lg text-slate-400"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>

              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-4">
                User Profile Settings
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                
                {/* Avatar Preview */}
                <div className="flex items-center space-x-3.5 pb-2">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-brand-500/25"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-950 dark:text-white">{user?.name}</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{user?.role} Account</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Display Name</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none"
                    required
                  />
                </div>

                {/* Role Changer (Useful to toggle Admin Dashboard link) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Account Access Role (Demo Toggle)</label>
                  <select
                    value={profRole}
                    onChange={(e) => setProfRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none"
                  >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Toggle to 'Administrator' to unlock the back-office Admin route in the user dropdown.</p>
                </div>

                {profileUpdated ? (
                  <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-655 rounded-xl text-xs flex items-center space-x-1.5">
                    <Check className="w-4 h-4" />
                    <span>Profile settings updated successfully!</span>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="px-4 py-2 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Update Profile
                    </button>
                  </div>
                )}

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Transaction Add Dialog */}
      <AnimatePresence>
        {quickAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setQuickAddOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-150 rounded-lg text-slate-400"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>

              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-4">
                Quick Ledger Entry
              </h3>

              <form onSubmit={handleQuickAdd} className="space-y-4">
                
                {/* Type toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => { setQaType("EXPENSE"); setQaCategory("Food & Grocery"); }}
                    className={`flex-1 py-2 rounded-lg text-center transition-colors ${qaType === "EXPENSE" ? "bg-white dark:bg-darkbg-800 text-rose-500 shadow-sm" : "text-slate-400"}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => { setQaType("INCOME"); setQaCategory("Salary"); }}
                    className={`flex-1 py-2 rounded-lg text-center transition-colors ${qaType === "INCOME" ? "bg-white dark:bg-darkbg-800 text-emerald-600 shadow-sm" : "text-slate-400"}`}
                  >
                    Income
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={qaAmount}
                      onChange={(e) => setQaAmount(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Category</label>
                    <select
                      value={qaCategory}
                      onChange={(e) => setQaCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Transaction Details</label>
                  <input
                    type="text"
                    value={qaNote}
                    onChange={(e) => setQaNote(e.target.value)}
                    placeholder="e.g. Coffee shop"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Post Entry
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
