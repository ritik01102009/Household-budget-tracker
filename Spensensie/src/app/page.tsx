"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SlideWrapper } from "@/components/slide-wrapper";
import { DashboardOverview } from "@/components/dashboard-overview";
import { DebtPayoffCalculator } from "@/components/debt-payoff-calculator";
import { SmartDebtRecommender } from "@/components/smart-debt-recommender";
import { BudgetTracker } from "@/components/budget-tracker";
import { SavingsTracker } from "@/components/savings-tracker";
import { EducationSection } from "@/components/education-section";
import { SubscriptionCalculator } from "@/components/subscription-calculator";
import { FaqSection } from "@/components/faq-section";
import { useLanguage } from "@/components/providers/language-provider";
import { Heart, Shield, FileText, Globe, BarChart3 } from "lucide-react";

const TABS_ORDER = ["dashboard", "debt", "recommender", "budget", "savings", "subscriptions", "education"];

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [prevTab, setPrevTab] = useState<string>("dashboard");

  const handleTabChange = (newTab: string) => {
    setPrevTab(activeTab);
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevIndex = TABS_ORDER.indexOf(prevTab);
  const currentIndex = TABS_ORDER.indexOf(activeTab);
  const slideDirection = currentIndex >= prevIndex ? "left" : "right";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header / Navbar with Language Icon & Theme toggle */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        <SlideWrapper activeKey={activeTab} direction={slideDirection}>
          {activeTab === "dashboard" && <DashboardOverview onNavigate={handleTabChange} />}
          {activeTab === "debt" && <DebtPayoffCalculator />}
          {activeTab === "recommender" && <SmartDebtRecommender onNavigate={handleTabChange} />}
          {activeTab === "budget" && <BudgetTracker />}
          {activeTab === "savings" && <SavingsTracker />}
          {activeTab === "subscriptions" && <SubscriptionCalculator />}
          {activeTab === "education" && <EducationSection />}
        </SlideWrapper>
      </main>

      <FaqSection />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm py-10 px-4 lg:px-8 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            {/* Brand */}
            <div className="space-y-3 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                  SS
                </div>
                <span className="font-black text-slate-800 dark:text-slate-100 text-base">家計管理</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("footer.brand_description")}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t("footer.privacy")}</span>
              </div>
            </div>

            {/* Navigation links grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              {/* Tools Column */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  {t("footer.tools_heading")}
                </p>
                {[
                  { label: t("nav.debt"), tab: "debt" },
                  { label: t("nav.recommender"), tab: "recommender" },
                  { label: t("nav.budget"), tab: "budget" },
                  { label: t("nav.savings"), tab: "savings" },
                  { label: t("nav.subscriptions"), tab: "subscriptions" },
                ].map(({ label, tab }) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className="block text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Education Column */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  {t("footer.learn_heading")}
                </p>
                {[
                  { label: language === "ja" ? "スノーボール返済法" : "Debt Snowball", tab: "education" },
                  { label: language === "ja" ? "アバランチ返済法" : "Debt Avalanche", tab: "education" },
                  { label: language === "ja" ? "50/30/20 家計ルール" : "50/30/20 Rule", tab: "education" },
                  { label: language === "ja" ? "生活防衛資金の作り方" : "Emergency Fund", tab: "education" },
                ].map(({ label, tab }) => (
                  <button
                    key={label}
                    onClick={() => handleTabChange(tab)}
                    className="block text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Features Column */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  {t("footer.features_heading")}
                </p>
                {[
                  { label: t("footer.pdf_export"), icon: FileText },
                  { label: t("footer.multi_language"), icon: Globe },
                  { label: t("footer.strategy_compare"), icon: BarChart3 },
                  { label: t("footer.privacy_first"), icon: Shield },
                ].map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Dashboard Column */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  {t("footer.dashboard_heading")}
                </p>
                {[
                  { label: t("nav.dashboard"), tab: "dashboard" },
                  { label: t("nav.debt"), tab: "debt" },
                  { label: t("nav.recommender"), tab: "recommender" },
                  { label: t("nav.education"), tab: "education" },
                ].map(({ label, tab }) => (
                  <button
                    key={label}
                    onClick={() => handleTabChange(tab)}
                    className="block text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Bottom row: Copyright, Heart message, Language toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} {t("footer.copyright")}</span>
            <div className="flex items-center gap-1">
              <span>{language === "ja" ? "安心・正確な設計で" : "Built with precision &"}</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" />
              <span>{t("footer.built_for")}</span>
            </div>
            {/* Quick Language Switcher in Footer */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setLanguage("ja")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  language === "ja"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                aria-label="日本語"
              >
                日本語
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
