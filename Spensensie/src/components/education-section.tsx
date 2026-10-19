"use client";

import React, { useState } from "react";
import { useLanguage } from "./providers/language-provider";
import { 
  Lightbulb, 
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  TrendingDown, 
  Sparkles,
  BookOpen
} from "lucide-react";

export function EducationSection() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tips = [
    {
      titleKey: "tip1_title",
      bodyKey: "tip1_body",
      icon: ShieldAlert,
      color: "from-amber-500 to-orange-500",
    },
    {
      titleKey: "tip2_title",
      bodyKey: "tip2_body",
      icon: Zap,
      color: "from-emerald-500 to-teal-500",
    },
    {
      titleKey: "tip3_title",
      bodyKey: "tip3_body",
      icon: Lightbulb,
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const faqs = [
    {
      q: "How does the SpendSensie debt payoff calculator compare to a debt payoff spreadsheet or Google Sheets?",
      a: "Unlike a static debt payoff spreadsheet or manual Google Sheets template, our interactive debt payoff calculator dynamically models Snowball, Avalanche, and Hybrid payoff strategies in real-time, giving you an automated debt payoff planner with instant visual charts and PDF export.",
      keywords: ["debt payoff calculator", "debt payoff spreadsheet", "debt payoff planner"],
    },
    {
      q: "Can I use SpendSensie as a credit card debt payoff calculator?",
      a: "Yes! SpendSensie functions as an advanced credit card debt payoff calculator. Simply enter your credit card balances, minimum payments, and APR interest rates to see exactly how much money and time you save using the Debt Avalanche or Debt Snowball strategy.",
      keywords: ["credit card debt payoff calculator", "debt payoff"],
    },
    {
      q: "Why is SpendSensie considered one of the best budget apps and free budgeting apps?",
      a: "As one of the best budgeting apps and top money management apps available, SpendSensie offers a complete budget tracker app, money tracker, and budget planner app experience with zero fees, no ads, and full client-side privacy.",
      keywords: ["best budget app", "free budgeting apps", "budgeting apps", "money management apps"],
    },
    {
      q: "How is a digital budget tracker app better than a budget tracker template?",
      a: "A dedicated free budget tracker app automatically computes net cash flow, visualizes expense category breakdowns, and exports professional PDF reports. It provides a much smoother experience than editing a manual budget tracker template or budget tracker Google Sheets.",
      keywords: ["budget tracker app", "free budget tracker", "budget tracker template", "budget tracker google sheets"],
    },
    {
      q: "What makes SpendSensie top-tier among money tracker and budget planner apps?",
      a: "SpendSensie combines a credit card debt payoff planner, interactive budget tracker, and emergency savings goal manager in one seamless platform, ranking it among the best apps for budgeting and financial freedom.",
      keywords: ["money tracker", "budget planner app", "best apps for budgeting"],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-900/10 via-slate-900/5 to-purple-900/10 border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>{t("tips_title")}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Master Your Money & Eliminate High-Interest Debt
        </h2>
      </div>

      {/* Featured Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tip.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t(tip.titleKey)}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t(tip.bodyKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordion FAQ Section */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              <span>Frequently Asked Questions & Financial Guides</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Everything you need to know about debt payoff calculators, budget tracking, and money management apps.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-900/50 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-emerald-500" : ""}`} />
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in space-y-3">
                    <p>{faq.a}</p>

                    {/* SEO Keyword Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Topics:</span>
                      {faq.keywords.map((kw, kidx) => (
                        <span
                          key={kidx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
