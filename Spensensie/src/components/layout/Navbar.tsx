"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { useAppState } from "@/lib/store";
import { 
  Menu, X, Sun, Moon, User as UserIcon, LayoutDashboard, 
  Settings, LogOut, ChevronDown, Calculator, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "it", label: "Italiano" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logoutUser } = useAppState();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Initialize from localStorage, navigator language, or default to 'en'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved) return saved;
      
      // Try to get language from navigator
      const navLang = navigator.language || navigator.languages?.[0];
      if (navLang) {
        // Extract just the language code (e.g., 'en' from 'en-US')
        const langCode = navLang.split('-')[0].toLowerCase();
        // Check if it's in our supported languages
        if (LANGUAGES.some(l => l.code === langCode)) {
          return langCode;
        }
      }
      
      return 'en';
    }
    return 'en';
  });

  const mainLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/budget", label: "Budget" },
    { href: "/goals", label: "Goals" },
    { href: "/tools", label: "Financial Tools" },
    { href: "/reports", label: "Reports" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  const calculators = [
    { href: "/calculators/membership", label: "Membership Cost" },
    { href: "/calculators/debt", label: "Debt Payoff (Snowball/Avalanche)" }
  ];

  const isActive = (path: string) => pathname === path;

const handleLanguageChange = (langCode: string) => {
     setSelectedLanguage(langCode);
     document.documentElement.lang = langCode;
     setLanguageDropdownOpen(false);
     // Persist to localStorage
     if (typeof window !== 'undefined') {
       localStorage.setItem('language', langCode);
     }
   };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-darkbg-900/95 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-limebrand-500 text-white font-bold shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                SS
              </span>
              <span className="font-bold text-xl font-display tracking-tight bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-limebrand-400 bg-clip-text text-transparent">
                SpendSensie
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Home</Link>
            <Link href="/dashboard" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/dashboard") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Dashboard</Link>

            <div className="relative">
              <button onClick={() => setCalcDropdownOpen(!calcDropdownOpen)} onBlur={() => setTimeout(() => setCalcDropdownOpen(false), 200)} className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/calculators") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>
                <span>Calculators</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {calcDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 p-2 shadow-xl">
                    {calculators.map((calc) => (
                      <Link key={calc.href} href={calc.href} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(calc.href) ? "bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 font-medium" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 dark:hover:text-brand-400"}`}>
                        <Calculator className="w-4 h-4 text-brand-500" />
                        <span>{calc.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/budget" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/budget") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Budget</Link>
            <Link href="/goals" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/goals") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Goals</Link>
            <Link href="/tools" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/tools") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Tools</Link>
            <Link href="/reports" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/reports") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Reports</Link>
            <Link href="/blog" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/blog") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Blog</Link>
            <Link href="/about" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/about") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>About</Link>
            <Link href="/contact" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/contact") ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>Contact</Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
<div className="relative">
              <button onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} onBlur={() => setTimeout(() => setLanguageDropdownOpen(false), 200)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-darkbg-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors" aria-label={`Select language: ${LANGUAGES.find(l => l.code === selectedLanguage)?.label || selectedLanguage.toUpperCase()}`}>
                <Globe className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium capitalize">{selectedLanguage.toUpperCase()}</span>
              </button>
              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 p-2 shadow-xl">
                    {LANGUAGES.map((lang) => (
                      <button key={lang.code} onClick={() => handleLanguageChange(lang.code)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedLanguage === lang.code ? "bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 font-medium" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 dark:hover:text-brand-400"}`}>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-darkbg-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors" aria-label="Toggle Theme">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)} className="flex items-center space-x-2 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 pr-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover ring-2 ring-brand-500/20" />
                  <div className="text-left text-xs">
                    <p className="font-semibold leading-tight text-slate-800 dark:text-slate-200 max-w-[100px] truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight truncate capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 p-2 shadow-xl">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Account</p>
                        <p className="text-sm font-semibold truncate dark:text-slate-200">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><LayoutDashboard className="w-4 h-4" /><span>My Dashboard</span></Link>
                      {user.role === "ADMIN" && (
                        <Link href="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Settings className="w-4 h-4" /><span>Admin Console</span></Link>
                      )}
                      <button onClick={logoutUser} className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"><LogOut className="w-4 h-4" /><span>Log Out</span></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Sign In</Link>
                <Link href="/register" className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-medium text-sm hover:shadow-lg hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Create Account</Link>
              </div>
            )}
          </div>

          <div className="flex items-center lg:hidden space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-darkbg-800 text-slate-600 dark:text-slate-300 transition-colors" aria-label="Toggle Theme">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-darkbg-800 text-slate-600 dark:text-slate-300 transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-900">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {mainLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive(link.href) ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/20" : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"}`}>{link.label}</Link>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Calculators</p>
                {calculators.map((calc) => (
                  <Link key={calc.href} href={calc.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400">{calc.label}</Link>
                ))}
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageChange(lang.code)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${selectedLanguage === lang.code ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2 px-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 pb-2">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-brand-500/20" />
                      <div><p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p><p className="text-xs text-slate-400 truncate capitalize">{user.role}</p></div>
                    </div>
                    {user.role === "ADMIN" && <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 py-2 text-slate-600 dark:text-slate-300 hover:text-brand-600"><Settings className="w-5 h-5 text-slate-400" /><span>Admin Console</span></Link>}
                    <button onClick={() => { logoutUser(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 py-2 text-rose-600 w-full text-left"><LogOut className="w-5 h-5" /><span>Sign Out</span></button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-sm font-medium hover:bg-slate-50 text-slate-700 dark:text-slate-300">Sign In</Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-center text-sm font-medium hover:bg-brand-700 shadow-lg shadow-brand-500/10">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
