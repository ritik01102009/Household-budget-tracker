"use client";

import React, { useState } from "react";
import { useLanguage } from "./providers/language-provider";
import { useTheme } from "./providers/theme-provider";
import { 
  TrendingDown, 
  Sun, 
  Moon, 
  Globe, 
  LayoutDashboard, 
  Calculator, 
  Compass, 
  Wallet, 
  PiggyBank, 
  Lightbulb,
  Check,
  ChevronDown,
  Menu,
  X,
  Tv
} from "lucide-react";
import { LanguageCode } from "@/lib/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { t, language, setLanguage, currentLangObj, languages } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: t("nav_dashboard"), icon: LayoutDashboard },
    { id: "debt", label: t("nav_debt"), icon: Calculator },
    { id: "recommender", label: t("nav_recommender"), icon: Compass },
    { id: "budget", label: t("nav_budget"), icon: Wallet },
    { id: "savings", label: t("nav_savings"), icon: PiggyBank },
    { id: "subscriptions", label: "Subscriptions", icon: Tv },
    { id: "education", label: t("nav_education"), icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#01796F]/20 dark:border-[#3E9F8E]/20 px-4 lg:px-8 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo in Pine Green */}
        <div 
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#014D47] via-[#01796F] to-[#3E9F8E] flex items-center justify-center shadow-md shadow-[#01796F]/30 group-hover:scale-105 transition-transform">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#01796F] via-[#01635B] to-[#3E9F8E] bg-clip-text text-transparent dark:from-[#3E9F8E] dark:to-[#67BBA9]">
              {t("app_title")}
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              {t("app_subtitle")}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-[#012724]/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-[#01796F]/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-[#023935] text-[#01796F] dark:text-[#3E9F8E] shadow-sm border border-[#01796F]/30 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-[#014D47]/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#01796F] dark:text-[#3E9F8E]" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Language Selector & Dark Mode Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#023935] hover:bg-slate-200 dark:hover:bg-[#014D47] text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/80 dark:border-[#01796F]/40"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-[#01796F] dark:text-[#3E9F8E]" />
              <span className="text-base">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-semibold">{currentLangObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#012724] rounded-2xl shadow-xl border border-slate-200 dark:border-[#01796F]/50 py-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setLangOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs hover:bg-[#E6F4F1] dark:hover:bg-[#023935] transition-colors ${
                      language === lang.code
                        ? "font-bold text-[#01796F] dark:text-[#3E9F8E] bg-[#E6F4F1]/60 dark:bg-[#023935]/60"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex flex-col text-left">
                        <span>{lang.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{lang.nativeName}</span>
                      </div>
                    </div>
                    {language === lang.code && <Check className="w-4 h-4 text-[#01796F] dark:text-[#3E9F8E]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#023935] hover:bg-slate-200 dark:hover:bg-[#014D47] text-slate-700 dark:text-slate-200 transition-all border border-slate-200/80 dark:border-[#01796F]/40 group"
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#01796F] group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#023935] text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-[#01796F]/40 flex flex-col gap-1.5 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#01796F] text-white shadow-md shadow-[#01796F]/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#023935]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
