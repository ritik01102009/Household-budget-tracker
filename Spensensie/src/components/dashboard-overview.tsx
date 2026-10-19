"use client";

import React, { useMemo, useState } from "react";
import { DEFAULT_DEBTS, calculateDebtStrategy, formatCurrency } from "@/lib/debt-utils";
import { useLanguage } from "./providers/language-provider";
import {
  TrendingDown,
  DollarSign,
  Calendar,
  Award,
  ArrowRight,
  Zap,
  ShieldCheck,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Lock,
  Globe,
  Smartphone,
  FileText,
  Target,
  PiggyBank,
  CreditCard,
  GraduationCap,
  Car,
  Home,
  RefreshCw,
  Star,
  Users,
  TrendingUp,
  AlertCircle,
  BadgeCheck,
  Layers,
} from "lucide-react";
import { FadeInStagger, FadeInItem } from "./slide-wrapper";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

// ── FAQ DATA ────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    category: "Getting Started",
    color: "emerald",
    items: [
      {
        q: "What information do I need to start a debt‑payoff plan?",
        a: "You only need three pieces of data for each debt: the current outstanding balance, the annual interest rate (APR), and the minimum monthly payment. Optional details like the lender name and debt type help you stay organized. SpendSensie never asks for account numbers, SSNs, or bank login credentials.",
      },
      {
        q: "What's the difference between debt snowball and debt avalanche?",
        a: "The Debt Snowball pays off your smallest balance first, giving you quick psychological wins and momentum. The Debt Avalanche targets the highest-interest debt first, minimizing the total interest you pay over time. SpendSensie calculates both side-by-side so you can see exactly how much each method costs you in time and money.",
      },
      {
        q: "Can I change my payoff strategy later?",
        a: "Absolutely. You can switch between Snowball, Avalanche, Highest Balance First, or Lowest Interest First at any point. SpendSensie instantly recalculates your payoff timeline and total interest so you can compare outcomes in real time without losing your entered data.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    color: "blue",
    items: [
      {
        q: "Do these apps connect to my bank accounts automatically?",
        a: "No — SpendSensie is 100% manual-entry by design. Your financial data never leaves your browser. There are no bank API connections, no Plaid integration, and no third-party data sharing. You input your numbers; we crunch them locally on your device.",
      },
      {
        q: "Is my financial data safe in these apps?",
        a: "Because SpendSensie runs entirely client-side, there is no server storing your debt figures. All calculations happen in your browser's memory. Closing the tab clears everything. For persistent storage, we use only your device's local storage — never a remote database.",
      },
      {
        q: "Do debt‑payoff apps actually pay my debts for me?",
        a: "No — debt-payoff calculators and planners are decision-support tools. They show you the optimal order and amount to pay each debt, but you still make the actual payments directly to your lenders. SpendSensie provides the roadmap; you drive the car.",
      },
    ],
  },
  {
    category: "Payments & Strategy",
    color: "amber",
    items: [
      {
        q: "What happens if I pay more than the minimum payment?",
        a: "Every extra dollar above the minimum goes directly toward reducing your principal balance. This is the core mechanic behind debt payoff acceleration. In SpendSensie you can model any extra monthly amount and immediately see how many months it shaves off your payoff date and how much interest it saves.",
      },
      {
        q: "Can I track multiple types of debt (credit cards, student loans, personal loans, car loans)?",
        a: "Yes. SpendSensie supports unlimited debt entries across all common categories: credit cards, student loans, personal loans, auto loans, medical debt, and more. Each debt entry tracks its own balance, APR, and minimum payment independently.",
      },
      {
        q: "Do these apps support mortgages?",
        a: "You can add a mortgage as a standard debt entry with its balance, rate, and minimum payment. Keep in mind that mortgage-specific features like amortization schedules and escrow are outside SpendSensie's current scope, which is optimized for consumer revolving and installment debt payoff planning.",
      },
    ],
  },
  {
    category: "Budgeting",
    color: "purple",
    items: [
      {
        q: "Can I set a monthly budget for debt repayment?",
        a: "Yes. The Budget Tracker lets you allocate a specific monthly category for debt payments. You set your income, fixed expenses, and discretionary spending — SpendSensie shows what's left for extra debt payments and models how different allocation amounts change your payoff timeline.",
      },
      {
        q: "What if my income or expenses change?",
        a: "Simply update your figures in the Budget Tracker or the Debt Payoff Calculator. SpendSensie recalculates everything instantly. You can model 'what-if' scenarios like a salary raise, a new expense, or a lump-sum payment without any data loss.",
      },
      {
        q: "Are there good free debt‑payoff apps?",
        a: "SpendSensie is completely free with no hidden paywalls, no premium tiers, and no feature locks. You get full access to the Debt Payoff Calculator, Budget Tracker, Savings Tracker, Smart Method Recommender, and PDF export — all free, forever.",
      },
    ],
  },
  {
    category: "App Comparison & Compatibility",
    color: "rose",
    items: [
      {
        q: "What's the difference between a budget tracker and a debt‑payoff app?",
        a: "A budget tracker manages your income and spending categories month-to-month. A debt-payoff app focuses specifically on modeling loan balances, interest rates, and payoff strategies over months or years. SpendSensie combines both: track your monthly budget and use those figures to fuel a precision debt-elimination plan.",
      },
      {
        q: "Can I use these apps if I live in another country or have debts in multiple currencies?",
        a: "SpendSensie supports multiple languages and currency symbols. You can configure your preferred currency symbol in settings. For multi-currency debts, the most practical approach is to work in your primary currency and convert foreign-currency balances at the current exchange rate when entering them.",
      },
      {
        q: "Do I need to link my bank to use a budget tracker?",
        a: "Not with SpendSensie. Everything is manually entered, which means you maintain complete privacy. Many users prefer this approach because it forces mindful engagement with each transaction rather than passive auto-import. You can export your plan as a professional PDF report at any time.",
      },
    ],
  },
  {
    category: "Netflix Cost Calculator",
    color: "red",
    items: [
      {
        q: "How much does Netflix cost per month in my country?",
        a: "Netflix pricing varies by country and plan tier (Standard with ads, Standard, and Premium). Use SpendSensie's cost-per-use calculator by entering your monthly subscription fee, then divide by your estimated monthly viewing hours to see your true cost per hour of entertainment.",
      },
      {
        q: "How do I calculate my Netflix cost per hour or cost per show?",
        a: "Divide your monthly Netflix cost by the number of hours you watch per month to get cost-per-hour. For cost-per-show, divide the monthly fee by the number of shows or movies you complete each month. SpendSensie's budget tracker makes it easy to log subscription costs and see their impact on your discretionary spending.",
      },
      {
        q: "How many hours do I need to watch for Netflix to be 'worth it'?",
        a: "A common benchmark is matching the cost of a single movie rental ($4–6). If your Netflix plan costs $15/month, watching 3–4 movies per month puts you at or below rental pricing. Watching 15+ hours per month typically makes it cheaper than any alternative per hour of content.",
      },
      {
        q: "Which Netflix plan gives the lowest cost per hour for my usage?",
        a: "The premium plan costs more upfront but allows 4 simultaneous streams. If 2–4 people share the cost, your per-person monthly fee drops significantly. Calculate your household's total viewing hours, split the plan cost evenly, then compare cost-per-hour across Standard and Premium tiers.",
      },
      {
        q: "How do I include extra members or add‑ons in my Netflix cost calculation?",
        a: "Add the base plan cost plus any extra member fees (typically $7–8/month per extra member in eligible countries). Enter this total in SpendSensie's budget tracker under 'Entertainment' to see how streaming subscriptions affect your overall monthly budget and debt payoff capacity.",
      },
      {
        q: "How do I compare Netflix cost per use with renting or buying movies?",
        a: "Movie rentals average $4–6 each; purchases $10–20. If you watch 4+ titles per month, a $15–18 Netflix plan typically wins on cost per view. For occasional viewers (1–2 titles/month), rental on demand is often cheaper. SpendSensie's budget breakdown helps you see which approach fits your financial goals.",
      },
      {
        q: "How do I calculate my total yearly cost if I keep Netflix for 1, 5, or 10 years?",
        a: "Multiply your monthly plan cost by 12 for the annual figure, then by the number of years. For example: $15.49/month × 12 = $185.88/year × 10 years = $1,858.80. Factor in that Netflix raises prices roughly every 1–2 years — a 5–10% annual increase compounding over a decade can push a 10-year total well past $2,000.",
      },
    ],
  },
];

// ── FEATURE DATA ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BarChart3,
    title: "4 Payoff Strategies",
    desc: "Snowball, Avalanche, Highest Balance, and Lowest Rate — compare all four side-by-side with exact month-by-month breakdowns.",
    color: "emerald",
  },
  {
    icon: Lock,
    title: "100% Private by Design",
    desc: "All calculations run locally in your browser. Your debt numbers never touch a server, database, or third-party service.",
    color: "blue",
  },
  {
    icon: Target,
    title: "Smart Method Recommender",
    desc: "Answer a few questions about your budget, stress tolerance, and goals — get a personalized strategy recommendation.",
    color: "purple",
  },
  {
    icon: PiggyBank,
    title: "Savings Goal Tracker",
    desc: "Set multiple savings targets, track contributions, and see projected completion dates alongside your debt elimination plan.",
    color: "amber",
  },
  {
    icon: FileText,
    title: "Professional PDF Export",
    desc: "Generate a detailed, print-ready debt payoff report you can share with a financial advisor or keep for your records.",
    color: "rose",
  },
  {
    icon: Globe,
    title: "Multi-Language & Currency",
    desc: "Available in 8 languages with configurable currency symbols — designed for users worldwide, not just the US.",
    color: "teal",
  },
];

// ── STEPS DATA ───────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter Your Debts",
    desc: "Add each debt with its balance, interest rate, and minimum payment. No bank login required — just the numbers from your statements.",
    icon: CreditCard,
  },
  {
    step: "02",
    title: "Set Your Extra Payment",
    desc: "Tell us how much extra you can put toward debt each month. Even $50/month can dramatically shorten your payoff timeline.",
    icon: DollarSign,
  },
  {
    step: "03",
    title: "Compare Strategies",
    desc: "SpendSensie instantly models every payoff strategy and shows you the interest saved, months saved, and payoff date for each.",
    icon: BarChart3,
  },
  {
    step: "04",
    title: "Follow Your Plan",
    desc: "Execute the strategy that matches your goals. Update your balances monthly and watch your debt-free date get closer.",
    icon: Target,
  },
];

// ── STATS DATA ───────────────────────────────────────────────────────────────
const PLATFORM_STATS = [
  { label: "Average interest saved", value: "$4,200+", icon: TrendingDown, color: "emerald" },
  { label: "Months cut off payoff", value: "18 mo", icon: Calendar, color: "blue" },
  { label: "Strategies modeled", value: "4 Methods", icon: Layers, color: "purple" },
  { label: "Cost to use SpendSensie", value: "Free", icon: BadgeCheck, color: "amber" },
];

// ── COLOR MAP ─────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-500",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-500",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-500",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-500",
    badge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-500",
    badge: "bg-red-500/20 text-red-400 border-red-500/40",
  },
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-500",
    badge: "bg-teal-500/20 text-teal-400 border-teal-500/40",
  },
};

// ── FAQ ACCORDION ─────────────────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
        open
          ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/[0.07]"
          : "border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <button
        id={`faq-btn-${index}`}
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-snug">
          {q}
        </span>
        <span className="shrink-0 mt-0.5">
          {open ? (
            <ChevronUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { t } = useLanguage();

  const debts = DEFAULT_DEBTS;
  const extraPayment = 300;

  const totalDebt = useMemo(() => debts.reduce((s, d) => s + d.balance, 0), [debts]);
  const totalMin = useMemo(() => debts.reduce((s, d) => s + d.minPayment, 0), [debts]);

  const avalancheRes = useMemo(
    () => calculateDebtStrategy(debts, extraPayment, "avalanche"),
    [debts, extraPayment]
  );
  const snowballRes = useMemo(
    () => calculateDebtStrategy(debts, extraPayment, "snowball"),
    [debts, extraPayment]
  );

  const interestSaved = Math.max(0, snowballRes.totalInterestPaid - avalancheRes.totalInterestPaid);
  const healthScore = Math.min(95, Math.max(45, Math.round(100 - totalDebt / 500 + extraPayment / 10)));

  return (
    <div className="space-y-20 pb-12">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="glass-panel p-8 sm:p-12 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white relative overflow-hidden rounded-3xl">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-lime-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
              <SparklesIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>SpendSensie 2.0 — Free, Private & Powerful</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
              Eliminate Debt{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-300 bg-clip-text text-transparent">
                Faster & Smarter
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              The most powerful free debt payoff calculator on the web. Compare Snowball & Avalanche strategies,
              model extra payments, track your budget, and generate professional PDF reports — all in your browser
              with zero data sharing.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { icon: Lock, label: "100% Private" },
                { icon: BadgeCheck, label: "Always Free" },
                { icon: Globe, label: "8 Languages" },
                { icon: FileText, label: "PDF Export" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-launch-btn"
                onClick={() => onNavigate("debt")}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-100"
              >
                <span>Launch Payoff Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-method-btn"
                onClick={() => onNavigate("recommender")}
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Find My Strategy</span>
              </button>
            </div>
          </div>

          {/* Health Score + Live Stats Card */}
          <div className="flex flex-col gap-4 min-w-[260px]">
            <div className="glass-card p-6 bg-slate-900/90 border-slate-700/80 text-center flex flex-col items-center space-y-3 shadow-2xl rounded-2xl">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-[5px] border-emerald-500 flex items-center justify-center text-4xl font-black text-emerald-400 bg-emerald-500/10">
                  {healthScore}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">{t("financial_health_score")}</h3>
                <p className="text-[11px] text-slate-400 max-w-[180px] mt-0.5">{t("health_score_desc")}</p>
              </div>
            </div>

            <div className="glass-card p-4 bg-slate-900/70 border-slate-700/60 rounded-2xl space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sample Snapshot</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Debt</span>
                  <span className="font-bold text-white">{formatCurrency(totalDebt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Payoff Date</span>
                  <span className="font-bold text-emerald-400">{avalancheRes.payoffDate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Interest Saved</span>
                  <span className="font-bold text-amber-400">+{formatCurrency(interestSaved)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM STATS ───────────────────────────────────────────────── */}
      <section aria-label="Platform statistics">
        <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATFORM_STATS.map(({ label, value, icon: Icon, color }) => {
            const c = COLOR_MAP[color] || COLOR_MAP.emerald;
            return (
              <FadeInItem key={label}>
                <div className={`glass-card p-6 rounded-2xl border-l-4 ${c.border} space-y-2 group hover:scale-[1.02] transition-transform`}>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</div>
                </div>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </section>

      {/* ── LIVE METRICS ─────────────────────────────────────────────────── */}
      <section aria-label="Live debt metrics">
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Your Debt Snapshot
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Based on sample data — replace with your real numbers in the Debt Engine
          </p>
        </div>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: t("total_debt"), value: formatCurrency(totalDebt), sub: `Across ${debts.length} accounts`, color: "emerald" },
            { label: t("monthly_min_payments"), value: formatCurrency(totalMin), sub: "Contractual minimums", color: "blue" },
            { label: t("extra_payment"), value: `+${formatCurrency(extraPayment)}`, sub: "Accelerates payoff", color: "amber" },
            { label: t("debt_free_date"), value: avalancheRes.payoffDate, sub: `In ${avalancheRes.totalMonths} mo (Avalanche)`, color: "purple" },
          ].map(({ label, value, sub, color }) => {
            const c = COLOR_MAP[color];
            return (
              <FadeInItem key={label}>
                <div className={`glass-card p-6 space-y-2 border-l-4 ${c.border} rounded-2xl`}>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{label}</span>
                  <div className={`text-2xl font-black ${color === "amber" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>{value}</div>
                  <span className={`text-[11px] font-medium block ${color === "purple" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>{sub}</span>
                </div>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </section>

      {/* ── STRATEGY COMPARISON ──────────────────────────────────────────── */}
      <section aria-label="Strategy comparison" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-7 sm:p-8 space-y-5 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Avalanche vs Snowball</h3>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Interest Savings Potential</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-300">+{formatCurrency(interestSaved)}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              By using <strong>Debt Avalanche</strong> over Snowball with your ${extraPayment}/mo extra payment,
              you eliminate high APR charges faster and keep more money in your pocket.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avalanche Interest", value: formatCurrency(avalancheRes.totalInterestPaid), accent: "text-emerald-600 dark:text-emerald-400" },
              { label: "Snowball Interest", value: formatCurrency(snowballRes.totalInterestPaid), accent: "text-slate-800 dark:text-slate-200" },
              { label: "Avalanche Months", value: `${avalancheRes.totalMonths} mo`, accent: "text-emerald-600 dark:text-emerald-400" },
              { label: "Snowball Months", value: `${snowballRes.totalMonths} mo`, accent: "text-slate-800 dark:text-slate-200" },
            ].map(({ label, value, accent }) => (
              <div key={label} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block font-semibold text-[11px]">{label}</span>
                <span className={`text-base font-bold ${accent}`}>{value}</span>
              </div>
            ))}
          </div>

          <button
            id="strategy-deep-dive-btn"
            onClick={() => onNavigate("debt")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2"
          >
            Deep-Dive Calculator <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-panel p-7 sm:p-8 space-y-5 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Why SpendSensie?</h3>
          </div>

          <div className="space-y-3.5">
            {[
              { icon: BarChart3, text: "Real-time mathematical comparison of 4 proven debt payoff strategies." },
              { icon: Lock, text: "100% Client-side privacy — your debt numbers never leave your browser." },
              { icon: Target, text: "Smart recommendation wizard tailored to your stress level and budget." },
              { icon: Globe, text: "Multi-language support optimized for 8 global languages & currencies." },
              { icon: FileText, text: "One-click professional PDF export ready for financial advisor review." },
              { icon: PiggyBank, text: "Integrated Savings Goal Tracker with projected completion dates." },
            ].map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{text}</span>
              </div>
            ))}
          </div>

          <button
            id="why-open-calc-btn"
            onClick={() => onNavigate("debt")}
            className="w-full mt-2 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Open Interactive Debt Calculator
          </button>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
      <section aria-label="Features" id="features">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-4">
            <Star className="w-3.5 h-3.5" /> Everything You Need
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            One Platform. Complete Financial Control.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            SpendSensie combines a debt payoff engine, budget tracker, savings planner, and financial education hub — all free, all private.
          </p>
        </div>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => {
            const c = COLOR_MAP[color] || COLOR_MAP.emerald;
            return (
              <FadeInItem key={title}>
                <div className="glass-card p-6 rounded-2xl space-y-4 group hover:scale-[1.02] transition-all border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500/30">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section aria-label="How it works" id="how-it-works" className="glass-panel p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-xs mb-4">
            <RefreshCw className="w-3.5 h-3.5" /> Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Debt-Free in 4 Steps
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-lg mx-auto">
            No financial expertise required. SpendSensie guides you from data entry to a personalized elimination plan in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
            <div key={step} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-px bg-gradient-to-r from-emerald-500/50 to-transparent z-10" />
              )}
              <div className="glass-card p-6 rounded-2xl space-y-4 h-full border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-emerald-500/30 leading-none">{step}</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            id="how-it-works-start-btn"
            onClick={() => onNavigate("debt")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-100"
          >
            Start My Debt-Free Journey <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── DEBT TYPE CALLOUTS ────────────────────────────────────────────── */}
      <section aria-label="Supported debt types">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Every Type of Debt — One Place
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Track and strategize across all your debt categories simultaneously
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: CreditCard, label: "Credit Cards", color: "rose" },
            { icon: GraduationCap, label: "Student Loans", color: "blue" },
            { icon: DollarSign, label: "Personal Loans", color: "emerald" },
            { icon: Car, label: "Auto Loans", color: "amber" },
            { icon: Home, label: "Mortgages", color: "purple" },
            { icon: AlertCircle, label: "Medical Debt", color: "teal" },
          ].map(({ icon: Icon, label, color }) => {
            const c = COLOR_MAP[color];
            return (
              <div
                key={label}
                className={`glass-card p-5 rounded-2xl flex flex-col items-center gap-3 border ${c.border} ${c.bg} group hover:scale-105 transition-transform cursor-default`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/10 dark:bg-black/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <span className={`text-xs font-bold text-center ${c.text}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section
        aria-label="Trust and privacy"
        className="relative overflow-hidden glass-panel p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black">
            Your Data Stays{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">
              Yours. Always.
            </span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            SpendSensie is built on a privacy-first architecture. All debt calculations, budget figures, and savings
            targets run entirely in your browser. We have no database of your finances, no email required, no
            account creation, and no data brokering — ever.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Lock, label: "No Account Needed" },
              { icon: ShieldCheck, label: "No Server Storage" },
              { icon: BadgeCheck, label: "No Data Selling" },
              { icon: Users, label: "No Bank Linking" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
                <Icon className="w-4 h-4 text-emerald-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section aria-label="Frequently asked questions" id="faq">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs mb-4">
            <GraduationCap className="w-3.5 h-3.5" /> Knowledge Base
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about debt payoff planning, budgeting apps, and how SpendSensie works.
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_ITEMS.map(({ category, color, items }) => {
            const c = COLOR_MAP[color] || COLOR_MAP.emerald;
            return (
              <div key={category}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.badge}`}>
                    {category}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
                </div>

                <div className="space-y-3">
                  {items.map((item, i) => (
                    <FAQItem key={i} q={item.q} a={item.a} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA under FAQ */}
        <div className="mt-12 text-center glass-panel p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-200/50 dark:border-emerald-800/30">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Ready to start eliminating your debt?
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            It takes less than 2 minutes to enter your debts and see your personalized payoff plan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              id="faq-cta-debt-btn"
              onClick={() => onNavigate("debt")}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-105"
            >
              Open Debt Calculator <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="faq-cta-budget-btn"
              onClick={() => onNavigate("budget")}
              className="px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-600 transition-all flex items-center gap-2"
            >
              <PiggyBank className="w-4 h-4 text-emerald-500" /> Budget Tracker
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

// ── SPARKLE ICON ─────────────────────────────────────────────────────────────
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}
