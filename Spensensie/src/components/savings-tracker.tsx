"use client";

import React, { useState } from "react";
import { SavingsGoal } from "@/lib/types";
import { formatCurrency } from "@/lib/debt-utils";
import { useLanguage } from "./providers/language-provider";
import { 
  PiggyBank, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  ArrowUpRight 
} from "lucide-react";
import { FadeInStagger, FadeInItem } from "./slide-wrapper";

const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: "1",
    title: "Starter Emergency Buffer",
    targetAmount: 2000,
    currentAmount: 1450,
    targetDate: "2026-12-31",
    category: "Emergency",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "2",
    title: "Car Maintenance Reserve",
    targetAmount: 1200,
    currentAmount: 800,
    targetDate: "2027-03-31",
    category: "Vehicle",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "3",
    title: "Annual Vacation Fund",
    targetAmount: 3000,
    currentAmount: 3000,
    targetDate: "2026-08-01",
    category: "Travel",
    color: "from-amber-500 to-orange-500",
  },
];

export function SavingsTracker() {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<SavingsGoal[]>(DEFAULT_GOALS);
  const [isAdding, setIsAdding] = useState(false);
  const [depositModalGoalId, setDepositModalGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(100);

  const [newGoal, setNewGoal] = useState<Omit<SavingsGoal, "id" | "color">>({
    title: "",
    targetAmount: 1000,
    currentAmount: 0,
    targetDate: "2027-01-01",
    category: "General",
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    const colors = [
      "from-emerald-500 to-teal-500",
      "from-blue-500 to-indigo-500",
      "from-purple-500 to-pink-500",
      "from-amber-500 to-orange-500",
    ];
    const goal: SavingsGoal = {
      ...newGoal,
      id: Date.now().toString(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setGoals([...goals, goal]);
    setIsAdding(false);
  };

  const handleDeposit = (id: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          return { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + depositAmount) };
        }
        return g;
      })
    );
    setDepositModalGoalId(null);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-900/10 via-slate-900/5 to-lime-900/10 border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <PiggyBank className="w-4 h-4" />
              <span>{t("savings_title")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Build Wealth & Emergency Buffers
            </h2>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_goal")}</span>
          </button>
        </div>
      </div>

      {/* Add Form Modal */}
      {isAdding && (
        <form onSubmit={handleAddGoal} className="glass-panel p-6 border-emerald-500/40 space-y-4 animate-in fade-in">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Financial Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Goal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Emergency Fund"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{t("target_amount")}</label>
              <input
                type="number"
                required
                min="100"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{t("current_amount")}</label>
              <input
                type="number"
                required
                min="0"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Target Date</label>
              <input
                type="date"
                required
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isCompleted = pct >= 100;

          return (
            <FadeInItem key={goal.id}>
              <div className="glass-card p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">
                    {goal.title}
                  </h3>
                  <span className="text-xs text-slate-400">Target Date: {goal.targetDate}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-300">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {pct}% ({formatCurrency(goal.targetAmount)})
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${goal.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl">
                      <Sparkles className="w-4 h-4" />
                      {t("goal_completed")}
                    </span>
                  ) : (
                    <button
                      onClick={() => setDepositModalGoalId(goal.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>{t("deposit")}</span>
                    </button>
                  )}
                </div>

                {/* Deposit Modal Popup */}
                {depositModalGoalId === goal.id && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm p-6 flex flex-col justify-between z-20 animate-in fade-in">
                    <h4 className="font-bold text-sm text-white">Deposit Funds to {goal.title}</h4>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-300">Amount ($)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDepositModalGoalId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeposit(goal.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white"
                      >
                        Confirm Deposit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </FadeInItem>
          );
        })}
      </FadeInStagger>
    </div>
  );
}
