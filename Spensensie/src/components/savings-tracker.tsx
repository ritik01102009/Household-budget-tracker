"use client";

import React, { useState } from "react";
import { Plus, Trash2, PiggyBank, FileText, Printer } from "lucide-react";
import type { SavingsGoal } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

const DEFAULT_GOALS_JA: SavingsGoal[] = [
  { id: "1", name: "生活防衛資金（3ヶ月分）", targetAmount: 1000000, currentAmount: 450000, color: "#10b981" },
  { id: "2", name: "温泉旅行・リフレッシュ", targetAmount: 150000, currentAmount: 90000, color: "#f59e0b" },
  { id: "3", name: "車検・買い替え積立", targetAmount: 800000, currentAmount: 220000, color: "#3b82f6" },
];

const DEFAULT_GOALS_EN: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 3500, color: "#10b981" },
  { id: "2", name: "Vacation Trip", targetAmount: 3000, currentAmount: 1200, color: "#f59e0b" },
  { id: "3", name: "New Car Downpayment", targetAmount: 20000, currentAmount: 5000, color: "#3b82f6" },
];

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6", "#f97316"];

import { PdfReportModal } from "@/components/pdf-report-modal";

export function SavingsTracker() {
  const { t, language } = useLanguage();
  const [goals, setGoals] = useState<SavingsGoal[]>(language === "ja" ? DEFAULT_GOALS_JA : DEFAULT_GOALS_EN);
  const [monthly, setMonthly] = useState(language === "ja" ? 50000 : 500);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const currencySymbol = language === "ja" ? "¥" : "$";

  const totalTarget = goals.reduce((s, g) => s + (Number(g.targetAmount) || 0), 0);
  const totalSaved = goals.reduce((s, g) => s + (Number(g.currentAmount) || 0), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const addGoal = () => {
    setGoals([
      ...goals,
      {
        id: Date.now().toString(),
        name: language === "ja" ? "新規目標" : "New Goal",
        targetAmount: language === "ja" ? 300000 : 2000,
        currentAmount: 0,
        color: COLORS[goals.length % COLORS.length],
      },
    ]);
  };

  const remove = (id: string) => setGoals(goals.filter((g) => g.id !== id));

  const update = (id: string, field: keyof SavingsGoal, value: string | number) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const monthsToGoal = (g: SavingsGoal) => {
    if (monthly <= 0) return "—";
    const target = Number(g.targetAmount) || 0;
    const current = Number(g.currentAmount) || 0;
    const remaining = target - current;
    if (remaining <= 0) return t("savings.completed");
    const m = Math.ceil(remaining / monthly);
    return `${m} ${t("savings.months_to_go")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with PDF & Print Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center shadow-md">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("savings.title")}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("savings.subtitle")}</p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "PDFプレビュー・保存" : "Preview & Export PDF"}
          >
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>{language === "ja" ? "PDF出力" : "Export PDF"}</span>
          </button>
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "目標シート印刷" : "Print Report"}
          >
            <Printer className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === "ja" ? "印刷" : "Print"}</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: t("savings.total_saved"),
            value: `${currencySymbol}${totalSaved.toLocaleString()}`,
            color: "text-sky-600 dark:text-sky-400",
          },
          {
            label: t("savings.total_target"),
            value: `${currencySymbol}${totalTarget.toLocaleString()}`,
            color: "text-slate-700 dark:text-slate-300",
          },
          {
            label: t("savings.overall_progress"),
            value: `${overallPct}%`,
            color: "text-emerald-600 dark:text-emerald-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs"
          >
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly savings slider */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex justify-between">
          <span>{t("savings.monthly_saving")}</span>
          <span className="text-sky-500 font-extrabold">
            {currencySymbol}
            {monthly.toLocaleString()}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={language === "ja" ? 300000 : 3000}
          step={language === "ja" ? 5000 : 50}
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full mt-3 accent-sky-500 cursor-pointer"
        />
      </div>

      {/* Goals list */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t("savings.goals_list")}</h3>
          <button
            onClick={addGoal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> {t("savings.add_goal")}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {goals.map((goal) => {
            const target = Number(goal.targetAmount) || 0;
            const current = Number(goal.currentAmount) || 0;
            const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
            const isDone = current >= target;

            return (
              <div
                key={goal.id}
                className="px-5 py-5 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  {/* Goal Name */}
                  <div className="sm:col-span-2">
                    <input
                      value={goal.name}
                      onChange={(e) => update(goal.id, "name", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-400"
                      placeholder={t("savings.goal_name_placeholder")}
                    />
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      {t("savings.target_amount")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={goal.targetAmount}
                        onChange={(e) => update(goal.id, "targetAmount", parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  {/* Current Amount & Delete */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        {t("savings.current_amount")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) => update(goal.id, "currentAmount", parseFloat(e.target.value) || 0)}
                          className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => remove(goal.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar + ETA */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className={isDone ? "text-emerald-500 font-bold" : "text-slate-500 dark:text-slate-400"}>
                      {pct}% · {t("savings.eta")}: {monthsToGoal(goal)}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {currencySymbol}
                      {current.toLocaleString()} / {currencySymbol}
                      {target.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDone ? "bg-emerald-500" : "bg-sky-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Report Modal */}
      <PdfReportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title={language === "ja" ? "貯蓄目標・資産形成 トラッキングレポート" : "Savings Goals & Asset Building Official Report"}
        subtitle={
          language === "ja"
            ? "各貯蓄目標の進捗状況と達成予定期間の算出明細レポートです。"
            : "Detailed analysis of your savings targets, current progress, and estimated completion timeline."
        }
        metrics={[
          { label: t("savings.total_target"), value: `${currencySymbol}${totalTarget.toLocaleString()}` },
          { label: t("savings.total_saved"), value: `${currencySymbol}${totalSaved.toLocaleString()}` },
          { label: t("savings.overall_progress"), value: `${overallPct}%` },
          { label: language === "ja" ? "毎月積立額" : "Monthly Savings", value: `${currencySymbol}${monthly.toLocaleString()}` },
        ]}
        tableHeaders={[
          language === "ja" ? "目標名称" : "Goal Name",
          language === "ja" ? "目標金額" : "Target Amount",
          language === "ja" ? "現在貯蓄額" : "Current Savings",
          language === "ja" ? "進捗率 / 達成予定" : "Progress / Timeline",
        ]}
        tableRows={goals.map((g) => {
          const tAmt = Number(g.targetAmount) || 0;
          const cAmt = Number(g.currentAmount) || 0;
          const pct = tAmt > 0 ? Math.min(100, Math.round((cAmt / tAmt) * 100)) : 0;
          return {
            col1: g.name,
            col2: `${currencySymbol}${tAmt.toLocaleString()}`,
            col3: `${currencySymbol}${cAmt.toLocaleString()}`,
            col4: `${pct}% (${monthsToGoal(g)})`,
          };
        })}
        summaryNotes={[
          language === "ja"
            ? `設定されている毎月の合計積み立て力: ${currencySymbol}${monthly.toLocaleString()}`
            : `Current Monthly Savings Allocation: ${currencySymbol}${monthly.toLocaleString()}`,
          language === "ja"
            ? "先取り貯蓄（給与天引きや自動振替）を活用することで達成速度をさらに加速できます。"
            : "Automating your monthly transfers into dedicated high-yield accounts ensures goal completion.",
        ]}
      />
    </div>
  );
}
