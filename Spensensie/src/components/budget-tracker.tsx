"use client";

import React, { useState, useMemo } from "react";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/debt-utils";
import { exportBudgetPDF } from "@/lib/pdf-export";
import { useLanguage } from "./providers/language-provider";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Trash2, 
  PieChart as PieIcon, 
  FileText,
  Calendar,
  Percent,
  Target,
  Sparkles,
  Edit3,
  Check,
  X,
  Settings2
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export interface CategoryParticular {
  id: string;
  name: string;
  icon: string; // Emoji icon (e.g. 🏠, 🛒, ⚡, 🚗, 🍿, 🏥)
  limit: number;
}

const DEFAULT_PARTICULARS: CategoryParticular[] = [
  { id: "1", name: "Housing", icon: "🏠", limit: 1600 },
  { id: "2", name: "Food & Groceries", icon: "🛒", limit: 600 },
  { id: "3", name: "Utilities", icon: "⚡", limit: 250 },
  { id: "4", name: "Transport & Fuel", icon: "🚗", limit: 300 },
  { id: "5", name: "Dining & Fun", icon: "🍿", limit: 250 },
  { id: "6", name: "Medical & Health", icon: "🏥", limit: 200 },
];

const AVAILABLE_ICONS = ["🏠", "🛒", "⚡", "🚗", "🍿", "🏥", "💡", "✈️", "🎓", "🎁", "💼", "📱", "🏋️", "🐾", "💸"];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "income", title: "Monthly Salary", amount: 5200, category: "Salary", date: "2026-10-01" },
  { id: "2", type: "expense", title: "Apartment Rent", amount: 1500, category: "Housing", date: "2026-10-02" },
  { id: "3", type: "expense", title: "Organic Groceries", amount: 480, category: "Food & Groceries", date: "2026-10-05" },
  { id: "4", type: "expense", title: "Electric & Water Utilities", amount: 190, category: "Utilities", date: "2026-10-08" },
  { id: "5", type: "expense", title: "Car Fuel & Insurance", amount: 220, category: "Transport & Fuel", date: "2026-10-10" },
  { id: "6", type: "income", title: "Freelance Consulting", amount: 750, category: "Side Hustle", date: "2026-10-14" },
  { id: "7", type: "expense", title: "Dining & Movies", amount: 160, category: "Dining & Fun", date: "2026-10-15" },
];

const PINE_COLORS = ["#01796F", "#3E9F8E", "#67BBA9", "#84CC16", "#F59E0B", "#EC4899", "#3B82F6"];

export function BudgetTracker() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [particulars, setParticulars] = useState<CategoryParticular[]>(DEFAULT_PARTICULARS);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-10");
  
  // Particular inline editing state
  const [editingParticularId, setEditingParticularId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CategoryParticular>({ id: "", name: "", icon: "🏠", limit: 500 });
  const [isAddingParticular, setIsAddingParticular] = useState(false);
  const [newParticular, setNewParticular] = useState<{ name: string; icon: string; limit: number }>({ name: "", icon: "💡", limit: 300 });

  // Add transaction state
  const [isAddingTx, setIsAddingTx] = useState(false);
  const [newTx, setNewTx] = useState<Omit<Transaction, "id">>({
    type: "expense",
    title: "",
    amount: 100,
    category: "Food & Groceries",
    date: `${selectedMonth}-15`,
  });

  // Filter transactions by selected month (YYYY-MM)
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(() => monthlyTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [monthlyTransactions]);
  const totalExpense = useMemo(() => monthlyTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [monthlyTransactions]);
  const netCashFlow = totalIncome - totalExpense;

  // Monthly Savings Rate %
  const savingsRate = useMemo(() => {
    if (totalIncome <= 0) return 0;
    return Math.max(0, Math.round((netCashFlow / totalIncome) * 100));
  }, [totalIncome, netCashFlow]);

  // Spending per category this month
  const categorySpending = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyTransactions.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [monthlyTransactions]);

  const categoryPieData = useMemo(() => {
    return Object.entries(categorySpending).map(([name, value]) => ({ name, value }));
  }, [categorySpending]);

  const handleStartEditParticular = (p: CategoryParticular) => {
    setEditingParticularId(p.id);
    setEditForm({ ...p });
  };

  const handleSaveEditParticular = () => {
    if (!editForm.name.trim()) return;
    setParticulars(particulars.map((p) => (p.id === editForm.id ? editForm : p)));
    setEditingParticularId(null);
  };

  const handleAddParticular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticular.name.trim()) return;
    const added: CategoryParticular = {
      ...newParticular,
      id: Date.now().toString(),
    };
    setParticulars([...particulars, added]);
    setNewParticular({ name: "", icon: "💡", limit: 300 });
    setIsAddingParticular(false);
  };

  const handleDeleteParticular = (id: string) => {
    setParticulars(particulars.filter((p) => p.id !== id));
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.title.trim()) return;
    setTransactions([
      { ...newTx, id: Date.now().toString() },
      ...transactions,
    ]);
    setNewTx({ type: "expense", title: "", amount: 100, category: particulars[0]?.name || "Food & Groceries", date: `${selectedMonth}-15` });
    setIsAddingTx(false);
  };

  const handleDeleteTx = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleExportPDF = () => {
    exportBudgetPDF(monthlyTransactions);
  };

  const formatMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-8">
      {/* Banner in Pine Green Theme */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-[#001715] via-[#012724] to-[#014D47] text-white border-[#3E9F8E]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[#67BBA9] font-bold text-xs uppercase tracking-wider mb-2 bg-[#01796F]/20 px-3 py-1 rounded-full border border-[#01796F]/40">
              <Wallet className="w-4 h-4 text-[#3E9F8E]" />
              <span>Pine Green Monthly Budget Planner</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manage Monthly Income, Budget Particular Icons & Savings Rate
            </h2>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 bg-[#023935] border border-[#3E9F8E]/30 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-md">
              <Calendar className="w-4 h-4 text-[#3E9F8E]" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer text-xs font-semibold"
              />
            </div>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01796F] to-[#3E9F8E] hover:from-[#01635B] hover:to-[#67BBA9] text-white font-bold text-xs shadow-md shadow-[#01796F]/30 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>

            <button
              onClick={() => setIsAddingTx(!isAddingTx)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#01796F] hover:bg-[#01635B] text-white font-bold text-xs shadow-md shadow-[#01796F]/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t("add_transaction")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-[#01796F]">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">{t("income")} ({formatMonthName(selectedMonth)})</span>
            <span className="text-2xl font-black text-[#01796F] dark:text-[#3E9F8E] mt-1 block">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] dark:bg-[#012724] text-[#01796F] dark:text-[#3E9F8E] flex items-center justify-center shadow-inner">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">{t("expense")}</span>
            <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 block">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-[#3E9F8E] bg-gradient-to-br from-[#001715] to-[#014D47] border-[#01796F]/30 text-white">
          <div>
            <span className="text-xs text-slate-300 font-semibold block">{t("net_monthly")}</span>
            <span className={`text-2xl font-black mt-1 block ${netCashFlow >= 0 ? "text-[#67BBA9]" : "text-red-400"}`}>
              {formatCurrency(netCashFlow)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#01796F]/30 text-[#67BBA9] flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-[#84CC16] bg-gradient-to-br from-[#012724] to-[#023935] border-[#01796F]/30 text-white">
          <div>
            <span className="text-xs text-slate-300 font-semibold block">Monthly Savings Rate</span>
            <span className="text-2xl font-black text-[#84CC16] mt-1 block">{savingsRate}%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#84CC16]/20 text-[#84CC16] flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Editable Monthly Particulars & Category Limits Grid */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#01796F] dark:text-[#3E9F8E]" />
              <span>Editable Budget Particulars & Icons ({formatMonthName(selectedMonth)})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click the edit icon on any particular item to customize its icon, category name, or monthly budget cap.
            </p>
          </div>

          <button
            onClick={() => setIsAddingParticular(!isAddingParticular)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E6F4F1] dark:bg-[#023935] hover:bg-[#C3E5DE] dark:hover:bg-[#014D47] text-xs font-bold text-[#01796F] dark:text-[#67BBA9] transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Particular</span>
          </button>
        </div>

        {/* Add Particular Modal/Form */}
        {isAddingParticular && (
          <form onSubmit={handleAddParticular} className="p-4 rounded-xl bg-slate-100 dark:bg-[#023935] border border-[#01796F]/40 space-y-3 animate-in fade-in">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Add Custom Budget Particular</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Choose Icon</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#001715] rounded-xl border border-slate-200 dark:border-slate-700 max-h-24 overflow-y-auto">
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewParticular({ ...newParticular, icon: ic })}
                      className={`text-lg p-1 rounded-lg transition-transform ${newParticular.icon === ic ? "bg-[#01796F] text-white scale-110" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Particular Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions"
                  value={newParticular.name}
                  onChange={(e) => setNewParticular({ ...newParticular, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Monthly Limit ($)</label>
                <input
                  type="number"
                  required
                  min="10"
                  value={newParticular.limit}
                  onChange={(e) => setNewParticular({ ...newParticular, limit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingParticular(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#01796F] text-white hover:bg-[#01635B]"
              >
                Save Particular
              </button>
            </div>
          </form>
        )}

        {/* Particular Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {particulars.map((p) => {
            const spent = categorySpending[p.name] || 0;
            const pct = Math.min(100, Math.round((spent / p.limit) * 100));
            const isOver = spent > p.limit;
            const isEditing = editingParticularId === p.id;

            return (
              <div key={p.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#023935]/80 border border-slate-200 dark:border-[#01796F]/50 space-y-3 relative group hover:border-[#01796F] transition-all">
                {isEditing ? (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1 bg-white dark:bg-[#001715] rounded-lg border">{editForm.icon}</span>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="flex-1 px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Select Icon</label>
                      <div className="flex flex-wrap gap-1 p-1.5 bg-white dark:bg-[#001715] rounded-lg border max-h-16 overflow-y-auto">
                        {AVAILABLE_ICONS.map((ic) => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, icon: ic })}
                            className={`text-sm p-1 rounded ${editForm.icon === ic ? "bg-[#01796F] text-white" : ""}`}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Monthly Budget Limit ($)</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.limit}
                        onChange={(e) => setEditForm({ ...editForm, limit: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setEditingParticularId(null)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSaveEditParticular}
                        className="px-2.5 py-1 rounded text-xs font-bold bg-[#01796F] text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1 bg-white dark:bg-[#001715] rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{p.icon}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold ${isOver ? "text-red-500" : "text-[#01796F] dark:text-[#67BBA9]"}`}>
                          ${spent} / ${p.limit}
                        </span>
                        <button
                          onClick={() => handleStartEditParticular(p)}
                          className="p-1 text-slate-400 hover:text-[#01796F] dark:hover:text-[#3E9F8E] transition-colors"
                          title="Edit Particular Icon & Limit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteParticular(p.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Particular"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isOver ? "bg-red-500" : "bg-gradient-to-r from-[#01796F] to-[#3E9F8E]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>{pct}% Used</span>
                      <span>{isOver ? `Over budget by $${spent - p.limit}!` : `$${p.limit - spent} remaining`}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddingTx && (
        <form onSubmit={handleAddTx} className="glass-panel p-6 border-[#01796F]/40 space-y-4 animate-in fade-in">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Record New Transaction ({formatMonthName(selectedMonth)})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Type</label>
              <select
                value={newTx.type}
                onChange={(e) => setNewTx({ ...newTx, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{t("title")}</label>
              <input
                type="text"
                required
                placeholder="e.g. Grocery store"
                value={newTx.title}
                onChange={(e) => setNewTx({ ...newTx, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{t("amount")}</label>
              <input
                type="number"
                required
                min="1"
                value={newTx.amount}
                onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{t("category")}</label>
              <select
                value={newTx.category}
                onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                {particulars.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.icon} {p.name}
                  </option>
                ))}
                <option value="Salary">💼 Salary</option>
                <option value="Side Hustle">⚡ Side Hustle</option>
                <option value="General">💸 General</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{t("date")}</label>
              <input
                type="date"
                required
                value={newTx.date}
                onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#001715] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTx(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#01796F] text-white hover:bg-[#01635B]"
            >
              Save Transaction
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Transaction History + Category Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* History List */}
        <div className="glass-panel p-6 sm:p-8 lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{formatMonthName(selectedMonth)} Transactions</span>
            <span className="text-xs text-slate-400 font-normal">{monthlyTransactions.length} entries</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {monthlyTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No transactions for {formatMonthName(selectedMonth)}. Click + Add Transaction to begin.</p>
            ) : (
              monthlyTransactions.map((tx) => {
                const particularObj = particulars.find((p) => p.name === tx.category);
                const categoryIcon = particularObj?.icon || (tx.type === "income" ? "💼" : "💸");

                return (
                  <div key={tx.id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#001715] border border-slate-200 dark:border-slate-700 text-lg flex items-center justify-center shrink-0">
                        {categoryIcon}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{tx.title}</h4>
                        <span className="text-[10px] text-slate-400">{tx.category} • {tx.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-extrabold text-sm ${tx.type === "income" ? "text-[#01796F] dark:text-[#3E9F8E]" : "text-slate-900 dark:text-white"}`}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                      <button
                        onClick={() => handleDeleteTx(tx.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-[#01796F] dark:text-[#3E9F8E]" />
              <span>Monthly Expense Breakdown</span>
            </h3>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PINE_COLORS[index % PINE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => `$${val}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            {categoryPieData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PINE_COLORS[idx % PINE_COLORS.length] }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">${cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
