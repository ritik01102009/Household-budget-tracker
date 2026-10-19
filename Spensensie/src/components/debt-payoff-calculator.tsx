"use client";

import React, { useState, useMemo } from "react";
import { Debt, DebtStrategy } from "@/lib/types";
import { DEFAULT_DEBTS, calculateDebtStrategy, formatCurrency } from "@/lib/debt-utils";
import { exportDebtPayoffPDF } from "@/lib/pdf-export";
import { useLanguage } from "./providers/language-provider";
import { 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  Percent, 
  Calendar,
  Layers,
  Info,
  Printer,
  FileText
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from "recharts";
import { FadeInStagger, FadeInItem } from "./slide-wrapper";

export function DebtPayoffCalculator() {
  const { t } = useLanguage();
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS);
  const [extraPayment, setExtraPayment] = useState<number>(300);
  const [activeStrategy, setActiveStrategy] = useState<DebtStrategy>("avalanche");

  // Form modal state for adding/editing debt
  const [isAdding, setIsAdding] = useState(false);
  const [newDebt, setNewDebt] = useState<Omit<Debt, "id">>({
    name: "",
    balance: 1000,
    minPayment: 30,
    interestRate: 18.0,
    category: "credit_card",
  });

  // Calculate results for all strategies to display instant comparisons
  const snowballResult = useMemo(() => calculateDebtStrategy(debts, extraPayment, "snowball"), [debts, extraPayment]);
  const avalancheResult = useMemo(() => calculateDebtStrategy(debts, extraPayment, "avalanche"), [debts, extraPayment]);
  const hybridResult = useMemo(() => calculateDebtStrategy(debts, extraPayment, "hybrid"), [debts, extraPayment]);
  const consolidationResult = useMemo(() => calculateDebtStrategy(debts, extraPayment, "consolidation"), [debts, extraPayment]);

  const activeResult = useMemo(() => {
    switch (activeStrategy) {
      case "snowball": return snowballResult;
      case "avalanche": return avalancheResult;
      case "hybrid": return hybridResult;
      case "consolidation": return consolidationResult;
    }
  }, [activeStrategy, snowballResult, avalancheResult, hybridResult, consolidationResult]);

  const totalBalance = useMemo(() => debts.reduce((s, d) => s + d.balance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((s, d) => s + d.minPayment, 0), [debts]);
  const interestSaved = Math.max(0, snowballResult.totalInterestPaid - avalancheResult.totalInterestPaid);

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.name.trim()) return;
    const debtToAdd: Debt = {
      ...newDebt,
      id: Date.now().toString(),
    };
    setDebts([...debts, debtToAdd]);
    setNewDebt({ name: "", balance: 1000, minPayment: 30, interestRate: 18.0, category: "credit_card" });
    setIsAdding(false);
  };

  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const handleResetSample = () => {
    setDebts(DEFAULT_DEBTS);
    setExtraPayment(300);
  };

  const handleExportPDF = () => {
    exportDebtPayoffPDF(debts, extraPayment, activeResult);
  };

  const strategiesList: { id: DebtStrategy; nameKey: string; descKey: string; icon: any; color: string }[] = [
    { id: "avalanche", nameKey: "strategy_avalanche", descKey: "avalanche_desc", icon: Zap, color: "from-amber-500 to-orange-500" },
    { id: "snowball", nameKey: "strategy_snowball", descKey: "snowball_desc", icon: TrendingDown, color: "from-emerald-500 to-teal-500" },
    { id: "hybrid", nameKey: "strategy_hybrid", descKey: "hybrid_desc", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
    { id: "consolidation", nameKey: "strategy_consolidation", descKey: "consolidation_desc", icon: ShieldCheck, color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-900/10 via-slate-900/5 to-lime-900/10 dark:from-emerald-950/40 dark:to-slate-900/60 border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>{t("debt_payoff_title")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("debt_payoff_subtitle")}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Export Professional PDF</span>
            </button>

            <button
              onClick={handleResetSample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-emerald-500" />
              <span>{t("reset_sample")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategiesList.map((item) => {
          const Icon = item.icon;
          const isSelected = activeStrategy === item.id;
          let monthVal = 0;
          let interestVal = 0;

          if (item.id === "snowball") { monthVal = snowballResult.totalMonths; interestVal = snowballResult.totalInterestPaid; }
          else if (item.id === "avalanche") { monthVal = avalancheResult.totalMonths; interestVal = avalancheResult.totalInterestPaid; }
          else if (item.id === "hybrid") { monthVal = hybridResult.totalMonths; interestVal = hybridResult.totalInterestPaid; }
          else { monthVal = consolidationResult.totalMonths; interestVal = consolidationResult.totalInterestPaid; }

          return (
            <div
              key={item.id}
              onClick={() => setActiveStrategy(item.id)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                  : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                {t(item.nameKey)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {t(item.descKey)}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("payoff_duration")}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{monthVal} {t("months")}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("total_interest_paid")}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(interestVal)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Monthly Payment Slider & Overall Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span>{t("extra_payment")}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust your discretionary monthly payment to see how much faster you become debt-free.
              </p>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-emerald-500/20">
              {formatCurrency(extraPayment)}
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="2000"
              step="25"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>$0</span>
              <span>$500</span>
              <span>$1,000</span>
              <span>$1,500</span>
              <span>$2,000+</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Quick Presets:</span>
            {[50, 150, 300, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setExtraPayment(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  extraPayment === val
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                +${val}
              </button>
            ))}
          </div>
        </div>

        {/* Strategy Summary Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Active Strategy Stats
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeResult.payoffDate}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">{t("debt_free_date")}</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {activeResult.totalMonths} <span className="text-lg font-medium text-emerald-400">{t("months")}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ({(activeResult.totalMonths / 12).toFixed(1)} {t("years")})
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">{t("total_interest_paid")}</span>
                  <span className="text-lg font-bold text-amber-400">{formatCurrency(activeResult.totalInterestPaid)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Out of Pocket</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(activeResult.totalAmountPaid)}</span>
                </div>
              </div>
            </div>
          </div>

          {interestSaved > 0 && activeStrategy === "snowball" && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Tip: Switching to <strong>Avalanche</strong> will save you <strong>{formatCurrency(interestSaved)}</strong> in interest!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recharts Timeline Graph */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              <span>{t("timeline_chart_title")}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualizing monthly debt reduction path under {t(`strategy_${activeStrategy}`)}.
            </p>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeResult.monthlySchedule} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="monthName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                contentStyle={{ 
                  backgroundColor: "rgba(15, 23, 42, 0.9)", 
                  borderColor: "rgba(51, 65, 85, 0.8)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px"
                }} 
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Area type="monotone" dataKey="totalRemaining" name="Remaining Balance" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRemaining)" />
              <Area type="monotone" dataKey="totalInterestPaid" name="Cumulative Interest" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorInterest)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Elimination Order Timeline */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{t("payoff_order_title")}</span>
        </h3>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeResult.payoffOrder.map((item, idx) => (
            <FadeInItem key={item.debtId}>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-emerald-500 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cleared in month {item.paidOffMonth}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  Done 🎉
                </span>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>

      {/* Debts List Table & Add Debt Action */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Debts Portfolio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Current Debt: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalBalance)}</strong> | Minimum Monthly: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(totalMinPayment)}</strong>
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_debt")}</span>
          </button>
        </div>

        {/* Form Modal / Inline Add */}
        {isAdding && (
          <form onSubmit={handleAddDebt} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-emerald-500/40 space-y-4 animate-in fade-in">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Add New Account</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">{t("debt_name")}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visa Gold"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">{t("balance")}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newDebt.balance}
                  onChange={(e) => setNewDebt({ ...newDebt, balance: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">{t("min_payment")}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newDebt.minPayment}
                  onChange={(e) => setNewDebt({ ...newDebt, minPayment: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">{t("interest_rate")}</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={newDebt.interestRate}
                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Save Debt
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">{t("debt_name")}</th>
                <th className="p-3.5">{t("balance")}</th>
                <th className="p-3.5">{t("min_payment")}</th>
                <th className="p-3.5">{t("interest_rate")}</th>
                <th className="p-3.5 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {debts.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {d.name}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{formatCurrency(d.balance)}</td>
                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">{formatCurrency(d.minPayment)}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
                      d.interestRate > 15 ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50" : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {d.interestRate}% APR
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteDebt(d.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Debt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
