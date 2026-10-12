"use client";

import React from "react";
import { TrendingDown, PiggyBank, CreditCard, Target, ArrowRight, DollarSign, BarChart3, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { t, language } = useLanguage();

  const tools = [
    {
      id: "debt",
      icon: CreditCard,
      title: t("tools.debt.title"),
      description: t("tools.debt.desc"),
      color: "from-rose-500 to-orange-400",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-800",
    },
    {
      id: "recommender",
      icon: BarChart3,
      title: t("tools.recommender.title"),
      description: t("tools.recommender.desc"),
      color: "from-violet-500 to-purple-400",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-200 dark:border-violet-800",
    },
    {
      id: "budget",
      icon: DollarSign,
      title: t("tools.budget.title"),
      description: t("tools.budget.desc"),
      color: "from-emerald-500 to-teal-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "savings",
      icon: PiggyBank,
      title: t("tools.savings.title"),
      description: t("tools.savings.desc"),
      color: "from-sky-500 to-blue-400",
      bg: "bg-sky-50 dark:bg-sky-950/30",
      border: "border-sky-200 dark:border-sky-800",
    },
    {
      id: "subscriptions",
      icon: Target,
      title: t("tools.subscriptions.title"),
      description: t("tools.subscriptions.desc"),
      color: "from-amber-500 to-yellow-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
    },
    {
      id: "education",
      icon: BookOpen,
      title: t("tools.education.title"),
      description: t("tools.education.desc"),
      color: "from-pink-500 to-rose-400",
      bg: "bg-pink-50 dark:bg-pink-950/30",
      border: "border-pink-200 dark:border-pink-800",
    },
  ];

  const stats = [
    { label: t("stats.avg_debt_label"), value: language === "ja" ? "約1,400万円" : "$96,371", sub: t("stats.avg_debt_sub") },
    { label: t("stats.apr_label"), value: "18.0% ~ 24.6%", sub: t("stats.apr_sub") },
    { label: t("stats.speed_label"), value: language === "ja" ? "3〜7年短縮" : "3–7 yrs", sub: t("stats.speed_sub") },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 md:p-12 text-white shadow-xl">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #84cc16 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            {t("hero.badge")}
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
            {t("hero.title_lead")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
              {t("hero.title_highlight")}
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => onNavigate("debt")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-extrabold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t("hero.start_debt")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("recommender")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-xs text-center"
            >
              {t("hero.find_method")}
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all"
          >
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{s.value}</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tools grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("tools.section_title")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("tools.section_desc")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>{language === "ja" ? "使ってみる" : "Open Tool"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
