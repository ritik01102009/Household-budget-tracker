"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Calculator, FileText, Printer } from "lucide-react";
import type { Debt } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

const DEFAULT_DEBTS_JA: Debt[] = [
  { id: "1", name: "クレジットカードA (リボ)", balance: 450000, interestRate: 15.0, minimumPayment: 15000 },
  { id: "2", name: "マイカーローン", balance: 1200000, interestRate: 3.5, minimumPayment: 30000 },
  { id: "3", name: "教育・奨学金ローン", balance: 800000, interestRate: 1.8, minimumPayment: 18000 },
];

const DEFAULT_DEBTS_EN: Debt[] = [
  { id: "1", name: "Credit Card A", balance: 5000, interestRate: 22.9, minimumPayment: 100 },
  { id: "2", name: "Car Loan", balance: 12000, interestRate: 6.5, minimumPayment: 250 },
  { id: "3", name: "Student Loan", balance: 8000, interestRate: 4.5, minimumPayment: 150 },
];

function calcPayoff(debts: Debt[], extraPayment: number, method: "snowball" | "avalanche") {
  if (!debts.length) return { months: 0, totalInterest: 0 };

  let remaining = debts.map((d) => ({ ...d, remaining: Number(d.balance) || 0 }));
  const sorted = [...remaining].sort((a, b) =>
    method === "snowball" ? a.remaining - b.remaining : (Number(b.interestRate) || 0) - (Number(a.interestRate) || 0)
  );

  let month = 0;
  let totalInterest = 0;
  const MAX_MONTHS = 600;

  while (sorted.some((d) => d.remaining > 0) && month < MAX_MONTHS) {
    month++;
    let extra = extraPayment;

    for (const debt of sorted) {
      if (debt.remaining <= 0) continue;
      const rate = Number(debt.interestRate) || 0;
      const interest = (debt.remaining * rate) / 100 / 12;
      totalInterest += interest;
      const minPay = Number(debt.minimumPayment) || 0;
      debt.remaining = debt.remaining + interest - minPay;
      if (debt.remaining < 0) {
        extra += Math.abs(debt.remaining);
        debt.remaining = 0;
      }
    }

    const focus = sorted.find((d) => d.remaining > 0);
    if (focus && extra > 0) {
      focus.remaining = Math.max(0, focus.remaining - extra);
    }
  }

  return { months: month, totalInterest };
}

import { PdfReportModal } from "@/components/pdf-report-modal";

export function DebtPayoffCalculator() {
  const { t, language } = useLanguage();
  const [debts, setDebts] = useState<Debt[]>(language === "ja" ? DEFAULT_DEBTS_JA : DEFAULT_DEBTS_EN);
  const [extra, setExtra] = useState(language === "ja" ? 20000 : 200);
  const [method, setMethod] = useState<"snowball" | "avalanche">("avalanche");
  const [showPdfModal, setShowPdfModal] = useState(false);

  const currencySymbol = language === "ja" ? "¥" : "$";

  const addDebt = () => {
    setDebts([
      ...debts,
      {
        id: Date.now().toString(),
        name: language === "ja" ? "新規借入" : "New Debt",
        balance: language === "ja" ? 100000 : 1000,
        interestRate: 14.5,
        minimumPayment: language === "ja" ? 5000 : 50,
      },
    ]);
  };

  const removeDebt = (id: string) => setDebts(debts.filter((d) => d.id !== id));

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const result = useMemo(() => calcPayoff(debts, extra, method), [debts, extra, method]);
  const altResult = useMemo(
    () => calcPayoff(debts, extra, method === "snowball" ? "avalanche" : "snowball"),
    [debts, extra, method]
  );

  const totalBalance = debts.reduce((s, d) => s + (Number(d.balance) || 0), 0);
  const totalMin = debts.reduce((s, d) => s + (Number(d.minimumPayment) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with PDF & Print Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-md">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("debt.title")}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("debt.subtitle")}</p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "PDFプレビュー・保存" : "Preview & Export PDF"}
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === "ja" ? "PDF出力" : "Export PDF"}</span>
          </button>
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={language === "ja" ? "レポート印刷" : "Print Report"}
          >
            <Printer className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === "ja" ? "印刷" : "Print"}</span>
          </button>
        </div>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: t("debt.total_debt"),
            value: `${currencySymbol}${Math.round(totalBalance).toLocaleString()}`,
            color: "text-rose-600 dark:text-rose-400",
          },
          {
            label: t("debt.min_payments"),
            value: `${currencySymbol}${Math.round(totalMin).toLocaleString()}`,
            color: "text-orange-600 dark:text-orange-400",
          },
          {
            label: t("debt.payoff_time"),
            value: `${result.months} ${t("debt.months")}`,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: t("debt.total_interest"),
            value: `${currencySymbol}${Math.round(result.totalInterest).toLocaleString()}`,
            color: "text-violet-600 dark:text-violet-400",
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

      {/* Strategy Selector & Extra Payment */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {t("debt.strategy_label")}
            </label>
            <div className="flex mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-1 gap-1">
              {(["snowball", "avalanche"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    method === m
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {t(`debt.${m}`)}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {method === "snowball" ? t("debt.snowball_desc") : t("debt.avalanche_desc")}
            </p>
          </div>

          <div className="flex-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex justify-between">
              <span>{t("debt.extra_payment")}</span>
              <span className="text-emerald-500 font-extrabold">
                {currencySymbol}
                {extra.toLocaleString()}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={language === "ja" ? 150000 : 1500}
              step={language === "ja" ? 5000 : 25}
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
              className="w-full mt-4 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Comparison between Strategies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {[
            {
              methodName: t(`debt.${method}`),
              badge: t("debt.current_active"),
              r: result,
              active: true,
            },
            {
              methodName: t(`debt.${method === "snowball" ? "avalanche" : "snowball"}`),
              badge: "",
              r: altResult,
              active: false,
            },
          ].map(({ methodName, badge, r, active }) => (
            <div
              key={methodName}
              className={`rounded-xl p-3.5 transition-all ${
                active
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
                  : "bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{methodName}</span>
                {badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    {badge}
                  </span>
                )}
              </div>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100">
                {r.months} {t("debt.months_suffix")}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {currencySymbol}
                {Math.round(r.totalInterest).toLocaleString()} {t("debt.interest_suffix")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debts Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t("debt.your_debts")}</h3>
          <button
            onClick={addDebt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> {t("debt.add_debt")}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              {/* Debt Name */}
              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase md:hidden block mb-1">
                  {t("debt.your_debts")}
                </label>
                <input
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                  placeholder={t("debt.debt_name_placeholder")}
                />
              </div>

              {/* Balance */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {t("debt.balance")}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={debt.balance}
                    onChange={(e) => updateDebt(debt.id, "balance", parseFloat(e.target.value) || 0)}
                    className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* APR % */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {t("debt.apr")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={debt.interestRate}
                  onChange={(e) => updateDebt(debt.id, "interestRate", parseFloat(e.target.value) || 0)}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Min Payment */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {t("debt.min_pay")}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={debt.minimumPayment}
                    onChange={(e) => updateDebt(debt.id, "minimumPayment", parseFloat(e.target.value) || 0)}
                    className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex items-center justify-end col-span-1 sm:col-span-2 md:col-span-1 pt-1 md:pt-0">
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="p-2.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer min-w-[40px] flex items-center justify-center"
                  title={t("debt.delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Report Modal */}
      <PdfReportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title={language === "ja" ? "借金返済シミュレーション 公式レポート" : "Debt Payoff Simulation Official Report"}
        subtitle={
          language === "ja"
            ? `選択された${method === "snowball" ? "スノーボール方式" : "アバランチ方式"}に基づく完済計算結果と各借入明細です。`
            : `Detailed analysis of your debt payoff plan using the ${method.toUpperCase()} method.`
        }
        metrics={[
          { label: t("debt.total_debt"), value: `${currencySymbol}${Math.round(totalBalance).toLocaleString()}` },
          { label: t("debt.min_payments"), value: `${currencySymbol}${Math.round(totalMin).toLocaleString()}` },
          { label: t("debt.payoff_time"), value: `${result.months} ${t("debt.months")}` },
          { label: t("debt.total_interest"), value: `${currencySymbol}${Math.round(result.totalInterest).toLocaleString()}` },
        ]}
        tableHeaders={[
          language === "ja" ? "借入名称" : "Debt Name",
          language === "ja" ? "借入残高" : "Balance",
          language === "ja" ? "年利(%)" : "APR (%)",
          language === "ja" ? "毎月最低返済" : "Min Payment",
        ]}
        tableRows={debts.map((d) => ({
          col1: d.name,
          col2: `${currencySymbol}${Math.round(d.balance).toLocaleString()}`,
          col3: `${d.interestRate}%`,
          col4: `${currencySymbol}${Math.round(d.minimumPayment).toLocaleString()}`,
        }))}
        summaryNotes={[
          language === "ja"
            ? `適用メソッド: ${method === "snowball" ? "スノーボール方式（少額借入から早期完済）" : "アバランチ方式（高金利から利息削減）"}`
            : `Applied Strategy: ${method === "snowball" ? "Snowball Method (Smallest Balance First)" : "Avalanche Method (Highest APR First)"}`,
          language === "ja"
            ? `毎月の繰り上げ追加返済額: ${currencySymbol}${extra.toLocaleString()}`
            : `Monthly Extra Payment: ${currencySymbol}${extra.toLocaleString()}`,
          language === "ja"
            ? "このレポートは暗号化されブラウザ内でのみ計算されています。必要に応じて印刷またはPDF保存してください。"
            : "This report is generated locally in your browser. Feel free to print or download as PDF.",
        ]}
      />
    </div>
  );
}
