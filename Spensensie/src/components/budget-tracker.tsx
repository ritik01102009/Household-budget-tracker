"use client";

import React, { useState } from "react";
import { Plus, Trash2, DollarSign, Wallet, FileText, Printer } from "lucide-react";
import type { BudgetCategory } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

const DEFAULT_CATEGORIES_JA: BudgetCategory[] = [
  { id: "1", name: "住居費・家賃", budgeted: 110000, spent: 110000, color: "#10b981" },
  { id: "2", name: "食費・日用品", budgeted: 65000, spent: 48000, color: "#f59e0b" },
  { id: "3", name: "光熱費・通信費", budgeted: 28000, spent: 24500, color: "#3b82f6" },
  { id: "4", name: "交際費・趣味", budgeted: 30000, spent: 38000, color: "#8b5cf6" },
  { id: "5", name: "交通費・車両費", budgeted: 15000, spent: 12000, color: "#ec4899" },
];

const DEFAULT_CATEGORIES_EN: BudgetCategory[] = [
  { id: "1", name: "Housing", budgeted: 1500, spent: 1500, color: "#10b981" },
  { id: "2", name: "Food & Groceries", budgeted: 600, spent: 450, color: "#f59e0b" },
  { id: "3", name: "Transport", budgeted: 400, spent: 320, color: "#3b82f6" },
  { id: "4", name: "Entertainment", budgeted: 200, spent: 280, color: "#8b5cf6" },
  { id: "5", name: "Utilities", budgeted: 250, spent: 210, color: "#ec4899" },
];

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6", "#f97316"];

import { PdfReportModal } from "@/components/pdf-report-modal";

export function BudgetTracker() {
  const { t, language } = useLanguage();
  const [income, setIncome] = useState(language === "ja" ? 350000 : 4000);
  const [categories, setCategories] = useState<BudgetCategory[]>(
    language === "ja" ? DEFAULT_CATEGORIES_JA : DEFAULT_CATEGORIES_EN
  );
  const [showPdfModal, setShowPdfModal] = useState(false);

  const currencySymbol = language === "ja" ? "¥" : "$";

  const totalBudgeted = categories.reduce((s, c) => s + (Number(c.budgeted) || 0), 0);
  const totalSpent = categories.reduce((s, c) => s + (Number(c.spent) || 0), 0);
  const remaining = income - totalSpent;

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: Date.now().toString(),
        name: language === "ja" ? "新規カテゴリ" : "New Category",
        budgeted: language === "ja" ? 20000 : 100,
        spent: 0,
        color: COLORS[categories.length % COLORS.length],
      },
    ]);
  };

  const remove = (id: string) => setCategories(categories.filter((c) => c.id !== id));

  const update = (id: string, field: keyof BudgetCategory, value: string | number) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="space-y-6">
      {/* Header with PDF & Print Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("budget.title")}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("budget.subtitle")}</p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "PDFプレビュー・保存" : "Preview & Export PDF"}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === "ja" ? "PDF出力" : "Export PDF"}</span>
          </button>
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "家計簿を印刷" : "Print Report"}
          >
            <Printer className="w-3.5 h-3.5 text-teal-500" />
            <span>{language === "ja" ? "印刷" : "Print"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: t("budget.monthly_income"),
            value: `${currencySymbol}${income.toLocaleString()}`,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: t("budget.total_budgeted"),
            value: `${currencySymbol}${totalBudgeted.toLocaleString()}`,
            color: "text-sky-600 dark:text-sky-400",
          },
          {
            label: t("budget.total_spent"),
            value: `${currencySymbol}${totalSpent.toLocaleString()}`,
            color: "text-orange-600 dark:text-orange-400",
          },
          {
            label: t("budget.remaining"),
            value: `${currencySymbol}${remaining.toLocaleString()}`,
            color: remaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
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

      {/* Income Setting Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          {t("budget.monthly_income")}
        </label>
        <div className="relative mt-2 max-w-sm">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
            {currencySymbol}
          </span>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Categories List Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t("budget.categories")}</h3>
          <button
            onClick={addCategory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> {t("budget.add_category")}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((cat) => {
            const budgetedNum = Number(cat.budgeted) || 0;
            const spentNum = Number(cat.spent) || 0;
            const pct = budgetedNum > 0 ? Math.min(100, Math.round((spentNum / budgetedNum) * 100)) : 0;
            const isOver = spentNum > budgetedNum;

            return (
              <div key={cat.id} className="px-5 py-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  {/* Category Name */}
                  <div className="sm:col-span-2">
                    <input
                      value={cat.name}
                      onChange={(e) => update(cat.id, "name", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                      placeholder={t("budget.name_placeholder")}
                    />
                  </div>

                  {/* Budgeted Input */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      {t("budget.budgeted")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={cat.budgeted}
                        onChange={(e) => update(cat.id, "budgeted", parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Spent Input & Delete */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        {t("budget.spent")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          value={cat.spent}
                          onChange={(e) => update(cat.id, "spent", parseFloat(e.target.value) || 0)}
                          className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => remove(cat.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className={isOver ? "text-rose-500 font-bold" : "text-slate-500 dark:text-slate-400"}>
                      {isOver ? t("budget.over_budget") : t("budget.within_budget")} ({pct}%)
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {currencySymbol}
                      {spentNum.toLocaleString()} / {currencySymbol}
                      {budgetedNum.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
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
        title={language === "ja" ? "月間家計簿・収支分析 公式レポート" : "Monthly Budget & Cash Flow Official Report"}
        subtitle={
          language === "ja"
            ? "設定された月収と各カテゴリの予算・実際の支出の明細レポートです。"
            : "Detailed statement of income, category budgets, and actual monthly spending."
        }
        metrics={[
          { label: t("budget.monthly_income"), value: `${currencySymbol}${income.toLocaleString()}` },
          { label: t("budget.total_budgeted"), value: `${currencySymbol}${totalBudgeted.toLocaleString()}` },
          { label: t("budget.total_spent"), value: `${currencySymbol}${totalSpent.toLocaleString()}` },
          { label: t("budget.net_remaining"), value: `${currencySymbol}${remaining.toLocaleString()}` },
        ]}
        tableHeaders={[
          language === "ja" ? "カテゴリ" : "Category",
          language === "ja" ? "予算額" : "Budgeted",
          language === "ja" ? "実績支出" : "Actual Spent",
          language === "ja" ? "差額・残り" : "Variance",
        ]}
        tableRows={categories.map((c) => {
          const b = Number(c.budgeted) || 0;
          const s = Number(c.spent) || 0;
          const diff = b - s;
          return {
            col1: c.name,
            col2: `${currencySymbol}${b.toLocaleString()}`,
            col3: `${currencySymbol}${s.toLocaleString()}`,
            col4: `${diff >= 0 ? "+" : ""}${currencySymbol}${diff.toLocaleString()}`,
          };
        })}
        summaryNotes={[
          language === "ja"
            ? `手元残金（貯蓄・投資回し可能額）: ${currencySymbol}${remaining.toLocaleString()}`
            : `Net Cash Flow Available: ${currencySymbol}${remaining.toLocaleString()}`,
          language === "ja"
            ? remaining >= 0
              ? "良好な収支バランスを維持できています。残金は貯蓄または繰り上げ返済に充当することを推奨します。"
              : "支出が収入を超過しています。上位のカテゴリ予算を見直すことを検討してください。"
            : remaining >= 0
              ? "Positive monthly budget balance. Consider transferring remaining cash to savings or extra debt payments."
              : "Warning: Total actual spending exceeds monthly income. Review top categories to optimize.",
        ]}
      />
    </div>
  );
}
