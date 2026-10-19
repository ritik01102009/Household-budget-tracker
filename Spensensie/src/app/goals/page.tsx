"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState, Goal } from "@/lib/store";
import { 
  Target, Plus, Trash2, Calendar, DollarSign, Sparkles, Check, 
  ArrowUpRight, PiggyBank, X, AlertCircle, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GoalTracker() {
  const { goals, addGoal, fundGoal, deleteGoal, addTransaction } = useAppState();

  // New Goal Form State
  const [newOpen, setNewOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Emergency Fund");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  // Funding Modal State
  const [fundOpen, setFundOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [fundAmt, setFundAmt] = useState("");
  const [fundType, setFundType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
  const [linkToBudget, setLinkToBudget] = useState(true);

  // Form submission
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !targetDate) return;

    addGoal({
      title,
      category,
      targetAmount: Number(targetAmount),
      currentAmount: currentAmount ? Number(currentAmount) : 0,
      targetDate
    });

    // Reset fields
    setTitle("");
    setCategory("Emergency Fund");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setNewOpen(false);
  };

  // Funding submission
  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !fundAmt || Number(fundAmt) <= 0) return;

    const amt = Number(fundAmt);
    const multiplier = fundType === "DEPOSIT" ? 1 : -1;
    
    // 1. Fund the goal
    fundGoal(selectedGoal.id, amt * multiplier);

    // 2. Auto-log transaction in budget tracker if checkbox is checked
    if (linkToBudget) {
      addTransaction({
        type: fundType === "DEPOSIT" ? "EXPENSE" : "INCOME",
        amount: amt,
        category: "Savings",
        date: new Date().toISOString().split("T")[0],
        note: `${fundType === "DEPOSIT" ? "Deposit into" : "Withdrawal from"} savings goal: ${selectedGoal.title}`,
        isRecurring: false
      });
    }

    setFundAmt("");
    setFundOpen(false);
  };

  // Helper: compute months remaining and required monthly savings
  const calculateGoalRequirements = (g: Goal) => {
    const today = new Date();
    const target = new Date(g.targetDate);
    
    // Diff in months
    let months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
    months = Math.max(1, months);

    const remainingAmt = Math.max(0, g.targetAmount - g.currentAmount);
    const neededPerMonth = remainingAmt / months;

    return {
      months,
      neededPerMonth: Math.round(neededPerMonth * 100) / 100,
      isAchieved: g.currentAmount >= g.targetAmount
    };
  };

  const categories = ["Emergency Fund", "Buy a House", "Buy a Car", "Vacation", "Education", "Retirement", "Custom"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center space-x-2">
                <Target className="w-8 h-8 text-brand-500" />
                <span>Savings Goal Planner</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Set savings milestones and automate budgets to secure your retirement or home purchase.</p>
            </div>
            
            <button
              onClick={() => setNewOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-500/15 mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Saving Goal</span>
            </button>
          </div>

          {/* Goal Cards Grid */}
          {goals.length === 0 ? (
            <div className="bg-white dark:bg-darkbg-800 border p-12 rounded-3xl text-center shadow-sm">
              <PiggyBank className="w-12 h-12 text-slate-350 mx-auto mb-4 animate-bounce" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">No active savings goals found.</p>
              <p className="text-xs text-slate-400 mt-1">Click the button above to define your emergency fund, car purchase, or holiday target.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {goals.map((g) => {
                const requirements = calculateGoalRequirements(g);
                const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                
                // Circular SVG properties
                const radius = 38;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percent / 100) * circumference;

                return (
                  <div 
                    key={g.id} 
                    className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] text-brand-655 font-bold uppercase tracking-wider bg-brand-500/10 px-2.5 py-1 rounded-full">{g.category}</span>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display mt-2">{g.title}</h3>
                        </div>
                        
                        {/* Circular Progress Gauge */}
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r={radius}
                              className="stroke-slate-100 dark:stroke-slate-750 fill-none"
                              strokeWidth="5"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r={radius}
                              className="stroke-brand-500 fill-none transition-all duration-700"
                              strokeWidth="5"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-xs font-bold text-slate-700 dark:text-slate-200">{percent}%</span>
                        </div>
                      </div>

                      {/* Amounts Display */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-3 rounded-2xl mb-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saved Balance</p>
                          <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">${g.currentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Goal Target</p>
                          <p className="text-base font-bold text-slate-700 dark:text-slate-350 mt-0.5">${g.targetAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Timeline status details */}
                      <div className="space-y-2 text-xs font-semibold text-slate-500 mb-6">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Deadline: {g.targetDate} ({requirements.months} months remaining)</span>
                        </div>

                        {!requirements.isAchieved ? (
                          <div className="flex items-center space-x-1.5 text-brand-655">
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                            <span>Contribute: <span className="font-bold">${requirements.neededPerMonth}</span>/month</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-brand-600 dark:text-brand-400 font-bold bg-brand-500/10 px-2 py-1 rounded-xl">
                            <Check className="w-4 h-4 text-brand-500" />
                            <span>Milestone Achieved!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Funding Button Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <button
                        onClick={() => {
                          setSelectedGoal(g);
                          setFundType("DEPOSIT");
                          setFundOpen(true);
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                      >
                        <PiggyBank className="w-3.5 h-3.5" />
                        <span>Fund Goal</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedGoal(g);
                            setFundType("WITHDRAW");
                            setFundOpen(true);
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          Withdraw
                        </button>
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded-xl"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Create Goal Modal */}
          <AnimatePresence>
            {newOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
                >
                  <button
                    onClick={() => setNewOpen(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-150 rounded-lg text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-4">
                    Create Savings Goal Target
                  </h3>

                  <form onSubmit={handleCreateGoal} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Goal Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Purchase Tesla, Vacation Fund"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Goal Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none font-semibold"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Target Date */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Target Date</label>
                        <input
                          type="date"
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Target Amount */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Target Value ($)</label>
                        <input
                          type="number"
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(e.target.value)}
                          placeholder="e.g. 10000"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none font-semibold"
                          required
                        />
                      </div>

                      {/* Initial Amount */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Initial Deposit ($)</label>
                        <input
                          type="number"
                          value={currentAmount}
                          onChange={(e) => setCurrentAmount(e.target.value)}
                          placeholder="Optional"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setNewOpen(false)}
                        className="px-4 py-2 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/15"
                      >
                        Launch Goal
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Funding / Withdraw Modal */}
          <AnimatePresence>
            {fundOpen && selectedGoal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
                >
                  <button
                    onClick={() => setFundOpen(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-150 rounded-lg text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-2">
                    {fundType === "DEPOSIT" ? "Add Savings to Goal" : "Withdraw Savings from Goal"}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 capitalize">Goal: {selectedGoal.title}</p>

                  <form onSubmit={handleFundSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Transaction Amount ($)</label>
                      <input
                        type="number"
                        value={fundAmt}
                        onChange={(e) => setFundAmt(e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-sm focus:outline-none font-semibold"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2 py-1.5">
                      <input
                        type="checkbox"
                        id="linkBudget"
                        checked={linkToBudget}
                        onChange={(e) => setLinkToBudget(e.target.checked)}
                        className="rounded text-emerald-500 accent-emerald-500 focus:ring-emerald-500"
                      />
                      <label htmlFor="linkBudget" className="text-xs text-slate-500 font-semibold cursor-pointer">
                        Auto-post this {fundType === "DEPOSIT" ? "deposit as an Expense" : "withdrawal as Income"} (under Category: Savings) in the Budget Tracker
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setFundOpen(false)}
                        className="px-4 py-2 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 text-white rounded-xl text-xs font-semibold shadow-md ${
                          fundType === "DEPOSIT" 
                            ? "bg-brand-600 hover:bg-brand-500 shadow-brand-500/15" 
                            : "bg-slate-800 hover:bg-slate-700"
                        }`}
                      >
                        Confirm Transaction
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}
