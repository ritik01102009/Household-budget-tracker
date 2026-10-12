"use client";

import React, { useState } from "react";
import { Plus, Trash2, Target, Check, Pause, FileText, Printer } from "lucide-react";
import type { Subscription } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

const DEFAULT_SUBS_JA: Subscription[] = [
  { id: "1", name: "Netflix", amount: 1490, frequency: "monthly", category: "エンタメ", active: true },
  { id: "2", name: "Spotify Premium", amount: 980, frequency: "monthly", category: "音楽", active: true },
  { id: "3", name: "iCloud+ (200GB)", amount: 400, frequency: "monthly", category: "クラウド", active: true },
  { id: "4", name: "Adobe Creative Cloud", amount: 77760, frequency: "yearly", category: "仕事・学習", active: false },
  { id: "5", name: "24hフィットネスジム", amount: 7480, frequency: "monthly", category: "ヘルスケア", active: true },
];

const DEFAULT_SUBS_EN: Subscription[] = [
  { id: "1", name: "Netflix", amount: 15.99, frequency: "monthly", category: "Entertainment", active: true },
  { id: "2", name: "Spotify", amount: 9.99, frequency: "monthly", category: "Entertainment", active: true },
  { id: "3", name: "iCloud", amount: 2.99, frequency: "monthly", category: "Storage", active: true },
  { id: "4", name: "Adobe CC", amount: 599.99, frequency: "yearly", category: "Work", active: false },
  { id: "5", name: "Gym Membership", amount: 45, frequency: "monthly", category: "Health", active: true },
];

import { PdfReportModal } from "@/components/pdf-report-modal";

export function SubscriptionCalculator() {
  const { t, language } = useLanguage();
  const [subs, setSubs] = useState<Subscription[]>(language === "ja" ? DEFAULT_SUBS_JA : DEFAULT_SUBS_EN);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const currencySymbol = language === "ja" ? "¥" : "$";

  const activeSubs = subs.filter((s) => s.active);
  const monthlyTotal = activeSubs.reduce(
    (sum, s) => sum + (s.frequency === "monthly" ? Number(s.amount) || 0 : (Number(s.amount) || 0) / 12),
    0
  );
  const yearlyTotal = monthlyTotal * 12;

  const addSub = () => {
    setSubs([
      ...subs,
      {
        id: Date.now().toString(),
        name: language === "ja" ? "新規サブスク" : "New Subscription",
        amount: language === "ja" ? 980 : 9.99,
        frequency: "monthly",
        category: language === "ja" ? "その他" : "Other",
        active: true,
      },
    ]);
  };

  const remove = (id: string) => setSubs(subs.filter((s) => s.id !== id));
  const toggle = (id: string) => setSubs(subs.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  const update = (id: string, field: keyof Subscription, value: string | number | boolean) => {
    setSubs(subs.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const byCategory: Record<string, number> = {};
  activeSubs.forEach((s) => {
    const m = s.frequency === "monthly" ? Number(s.amount) || 0 : (Number(s.amount) || 0) / 12;
    byCategory[s.category] = (byCategory[s.category] || 0) + m;
  });

  return (
    <div className="space-y-6">
      {/* Header with PDF & Print Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-md">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("subs.title")}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("subs.subtitle")}</p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "PDFプレビュー・保存" : "Preview & Export PDF"}
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === "ja" ? "PDF出力" : "Export PDF"}</span>
          </button>
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "サブスク一覧印刷" : "Print Report"}
          >
            <Printer className="w-3.5 h-3.5 text-yellow-500" />
            <span>{language === "ja" ? "印刷" : "Print"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: t("subs.active_count"),
            value: `${activeSubs.length}`,
            color: "text-amber-600 dark:text-amber-400",
          },
          {
            label: t("subs.monthly_cost"),
            value: `${currencySymbol}${Math.round(monthlyTotal).toLocaleString()}`,
            color: "text-orange-600 dark:text-orange-400",
          },
          {
            label: t("subs.yearly_cost"),
            value: `${currencySymbol}${Math.round(yearlyTotal).toLocaleString()}`,
            color: "text-rose-600 dark:text-rose-400",
          },
          {
            label: t("subs.inactive_count"),
            value: `${subs.length - activeSubs.length}`,
            color: "text-slate-500 dark:text-slate-400",
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

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
            {t("subs.category_breakdown")}
          </h3>
          <div className="space-y-3">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const pct = monthlyTotal > 0 ? Math.round((amount / monthlyTotal) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{cat}</span>
                      <span className="text-slate-800 dark:text-slate-100 font-bold">
                        {currencySymbol}
                        {Math.round(amount).toLocaleString()} / {language === "ja" ? "月" : "mo"} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Subscriptions list */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t("subs.all_subs")}</h3>
          <button
            onClick={addSub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> {t("subs.add_sub")}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {subs.map((sub) => (
            <div
              key={sub.id}
              className={`px-5 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center transition-colors ${
                sub.active ? "hover:bg-slate-50/50 dark:hover:bg-slate-800/30" : "opacity-60 bg-slate-50/40 dark:bg-slate-900/40"
              }`}
            >
              {/* Name & Active status */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(sub.id)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    sub.active
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
                  }`}
                  title={sub.active ? t("subs.active") : t("subs.paused")}
                >
                  {sub.active ? <Check className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <input
                  value={sub.name}
                  onChange={(e) => update(sub.id, "name", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  placeholder={t("subs.sub_name_placeholder")}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {t("subs.cost")}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={sub.amount}
                    onChange={(e) => update(sub.id, "amount", parseFloat(e.target.value) || 0)}
                    className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {language === "ja" ? "請求サイクル" : "Frequency"}
                </label>
                <select
                  value={sub.frequency}
                  onChange={(e) => update(sub.id, "frequency", e.target.value as "monthly" | "yearly")}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="monthly">{t("subs.monthly")}</option>
                  <option value="yearly">{t("subs.yearly")}</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {t("subs.category")}
                </label>
                <input
                  value={sub.category}
                  onChange={(e) => update(sub.id, "category", e.target.value)}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Delete */}
              <div className="flex justify-end">
                <button
                  onClick={() => remove(sub.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
