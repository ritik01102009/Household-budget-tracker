 "use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  TrendingUp, Shield, BarChart3, Target, ArrowRight, 
  Percent, ChevronDown, CheckCircle, Calculator, Sparkles,
  Award, MessageSquare, Quote, PiggyBank, DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Statistics
  const stats = [
    { value: "$12.4M+", label: "Debt Tracked & Paid" },
    { value: "48,000+", label: "Financial Accounts Linked" },
    { value: "$2.8M+", label: "Interest Payments Saved" },
    { value: "99.4%", label: "User Satisfaction" }
  ];

  // Features
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-500" />,
      title: "Category Budgets & Alerts",
      description: "Define custom category limits. Receive real-time push alerts and indicators when you reach 80% and 100% of allocations."
    },
    {
      icon: <Calculator className="w-6 h-6 text-lime-500" />,
      title: "Debt Avalanche vs Snowball",
      description: "Input multiple balances and compare algorithms. Choose between psychological quick wins or mathematical interest optimization."
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      title: "Visual Goal Milestones",
      description: "Create tracking targets for buying homes, vacations, or retirement. Allocate savings directly to goals in one click."
    },
    {
      icon: <Shield className="w-6 h-6 text-lime-500" />,
      title: "On-Device Secure Sandbox",
      description: "No data logs or privacy selling. SpendSensie prioritizes your data safety with local-first, zero-knowledge processing."
    }
  ];

  // Financial Tips
  const tips = [
    { title: "The 24-Hour Rule", desc: "Before any non-essential purchase over $100, wait 24 hours. If you still want it, buy it. This cuts impulse spending by 60%." },
    { title: "Target High-APR Debts First", desc: "Paying off a credit card with 22% APR yields a guaranteed 22% rate of return on your money. Avoid low-yield savings until high debt is gone." },
    { title: "Automate Your Savings Transfer", desc: "Treat savings like a bill. Configure your bank to route 10% of your paycheck directly into index portfolios the moment it arrives." }
  ];

  // FAQs
  const faqs = [
    {
      q: "How does the Debt Payoff side-by-side comparison work?",
      a: "SpendSensie simulates month-by-month payment projections. The Avalanche method targets the highest interest rate first, reducing total interest charges. The Snowball method pays the smallest balance first, helping you gain momentum. We show you the exact debt-free dates and interest amounts for both!"
    },
    {
      q: "Can I use SpendSensie without linking my actual bank accounts?",
      a: "Yes! SpendSensie is designed for maximum privacy. You can manually enter, edit, and categorize your transactions, giving you full control without typing in sensitive banking credentials."
    },
    {
      q: "How does the Membership Calculator help save money?",
      a: "It breaks down annual subscriptions (gyms, software, clubs) into daily, weekly, and monthly rates, accounts for joining and processing fees, and evaluates taxes. This reveals the true cost, helping you decide if the membership is worth it."
    },
    {
      q: "What files can I download from my reports?",
      a: "You can download full statements in CSV formats, Excel sheets (table structured), or print customized formatted PDF templates directly from your browser."
    }
  ];

  // Testimonials
  const reviews = [
    {
      name: "Marcus Miller",
      role: "Freelance Designer",
      quote: "The visual amortization comparison tool is incredible. Seeing my debt-free date move closer in real-time kept me motivated to pay off $14,000 in credit card balances in just 18 months.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    {
      name: "Sophia Vance",
      role: "Operations Manager",
      quote: "I use the Membership Calculator for all my software subscriptions. It helped me realize I was spending $90/month on tools I barely opened. Highly recommend SpendSensie!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
    }
  ];

  // Live Interactive Quick-sip widget states
  const [quickSipAmt, setQuickSipAmt] = useState(250);
  const [quickSipRate, setQuickSipRate] = useState(10);
  const [quickSipYears, setQuickSipYears] = useState(15);

const calculateQuickSip = () => {
  const P = quickSipAmt;
  const r = quickSipRate / 12 / 100;
  const n = quickSipYears * 12;
  
  // Formula: S = P * [ (1 + r)^n - 1 ] * (1 + r) / r
  if (r === 0) {
    const total = P * n;
    return {
      total: Math.round(total),
      invested: Math.round(total),
      wealth: 0
    };
  }
  const total = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
  const invested = P * n;
  const wealth = total - invested;
  return {
    total: Math.round(total),
    invested: Math.round(invested),
    wealth: Math.round(wealth)
  };
};

  const sipResult = calculateQuickSip();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-brand-50/40 via-white to-white dark:from-darkbg-950 dark:via-darkbg-900 dark:to-darkbg-900 transition-colors duration-200">
        {/* Glow Spheres */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-lime-500/10 dark:bg-lime-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse-slow" />
                <span>Next-Gen Financial Intelligence Engine</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-display"
              >
                Empower Your Capital.<br/>
                <span className="text-gradient">Accelerate Your Wealth.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Manage memberships, compare Avalanche & Snowball payoff schedules, set custom category alerts, and generate exportable reports in one dashboard.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-medium shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 group hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/calculators/debt"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center space-x-2 transition-all"
                >
                  <Calculator className="w-4 h-4 text-emerald-500" />
                  <span>Payoff Calculator</span>
                </Link>
              </motion.div>
            </div>

            {/* Hero Right Widget (Interactive Live Preview SIP) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="glass-card-premium rounded-2xl p-6 sm:p-8 border border-white/20 dark:border-slate-800 shadow-2xl relative">
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-limebrand-500 text-darkbg-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-lg animate-bounce">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Interactive</span>
                </div>
                
                <h3 className="font-bold text-lg font-display text-slate-900 dark:text-white mb-1 flex items-center space-x-2">
                  <PiggyBank className="w-5 h-5 text-emerald-500" />
                  <span>Instant Growth Projection</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">See how regular monthly investments compound over time.</p>

                <div className="space-y-5">
                  {/* Slider 1: Monthly amount */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600 dark:text-slate-400">Monthly Contribution</span>
                      <span className="text-brand-600 dark:text-brand-400">${quickSipAmt}/mo</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={quickSipAmt}
                      onChange={(e) => setQuickSipAmt(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  {/* Slider 2: Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600 dark:text-slate-400">Expected Annual Rate</span>
                      <span className="text-brand-600 dark:text-brand-400">{quickSipRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="18"
                      step="0.5"
                      value={quickSipRate}
                      onChange={(e) => setQuickSipRate(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  {/* Slider 3: Years */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600 dark:text-slate-400">Investment Duration</span>
                      <span className="text-brand-600 dark:text-brand-400">{quickSipYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={quickSipYears}
                      onChange={(e) => setQuickSipYears(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  {/* Calculation Result */}
                  <div className="pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Invested Amount</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-0.5">${sipResult.invested.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-500/10 dark:bg-emerald-500/5 p-3.5 rounded-xl border border-brand-500/20">
                      <p className="text-[10px] text-brand-600 dark:text-brand-400 uppercase tracking-wider font-semibold">Future Value</p>
                      <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-0.5">${sipResult.total.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                    <span>Estimated compounding returns calculator</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 md:py-28 bg-white dark:bg-darkbg-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400 font-bold mb-3 flex items-center justify-center space-x-1.5">
              <Award className="w-4 h-4" />
              <span>Engineered Core Solutions</span>
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Advanced Tools Built for Financial Wellness
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              Why settle for clunky spreadsheets? SpendSensie delivers dynamic calculators, visual amortizations, and budget thresholds in a unified dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <div 
                key={i} 
                className="bg-slate-50 dark:bg-darkbg-800 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-500/30 dark:hover:border-brand-500/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-5 mb-2 font-display">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Tips Section */}
      <section className="py-20 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400 font-bold">
                Smart Hacks
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                Weekly Financial Tips for Everyday Growth
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Empower your decision-making with curated rules. Try adding these rules to your monthly budgeting parameters to see savings grow.
              </p>
              <div className="pt-2">
                <Link
                  href="/blog"
                  className="inline-flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <span>Read more financial wisdom on our Blog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column (Tips List) */}
            <div className="lg:col-span-7 space-y-6">
              {tips.map((tip, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/80 flex items-start space-x-4 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    0{i+1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white font-display text-base mb-1">{tip.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Slider */}
      <section className="py-20 md:py-28 bg-white dark:bg-darkbg-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400 font-bold mb-3">
              User Testimonials
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Loved by Debt-Slashers & Wealth-Builders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-slate-50 dark:bg-darkbg-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-200 dark:text-slate-700/40 group-hover:scale-110 transition-transform" />
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed mb-6 italic text-sm">
                  "{rev.quote}"
                </p>
                <div className="flex items-center space-x-3.5">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-950 dark:text-white font-display text-sm">{rev.name}</h4>
                    <p className="text-xs text-slate-400">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400 font-bold mb-3 flex items-center justify-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>Questions & Answers</span>
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-darkbg-800 rounded-xl border border-slate-200/60 dark:border-slate-850 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 border-t border-slate-50 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-darkbg-900 relative transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-tr from-brand-600 to-brand-800 dark:from-brand-900 dark:to-slate-900 overflow-hidden p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl">
            {/* Background sparkles */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                Ready to Master Your Finances?
              </h2>
              <p className="text-brand-100 text-base sm:text-lg leading-relaxed">
                Create your secure account in under 30 seconds. Start setting budget alerts, funding goals, and planning your debt-free timeline today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-brand-950 font-bold hover:bg-slate-50 shadow-xl transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-800/40 text-white border border-brand-400/30 hover:bg-brand-800/60 font-semibold transition-all"
                >
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
