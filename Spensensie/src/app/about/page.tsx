"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Target, Users, TrendingUp, Award, Heart } from "lucide-react";

export default function About() {
  const values = [
    { icon: <Shield className="w-6 h-6 text-emerald-500" />, title: "Privacy First", desc: "All data is processed locally on your device. We never store or sell your financial information." },
    { icon: <Target className="w-6 h-6 text-lime-500" />, title: "Goal-Oriented", desc: "Every feature is designed to help you reach financial milestones faster and smarter." },
    { icon: <Users className="w-6 h-6 text-emerald-500" />, title: "Community-Driven", desc: "Built by the community, for the community. Feedback shapes our product roadmap." },
    { icon: <TrendingUp className="w-6 h-6 text-lime-500" />, title: "Continuous Innovation", desc: "We ship new calculators and insights tools every week to keep you ahead of the curve." },
  ];

  const team = [
    { name: "Elena Vance", role: "Co-Founder & CEO", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80" },
    { name: "Marcus Reid", role: "CTO & Lead Engineer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
    { name: "Sarah Jenkins", role: "Head of Product", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80" },
    { name: "Alex Sterling", role: "Lead Financial Analyst", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/30 to-white dark:from-darkbg-950 dark:to-darkbg-900 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-100/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold">
              <Heart className="w-4 h-4 text-emerald-500" />
              <span>Built for Financial Freedom</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Our Mission is to Make<br />
              <span className="text-gradient">Finance Accessible to All</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              SpendSensie was founded on the belief that managing money shouldn't require a finance degree. We combine powerful calculators, intuitive dashboards, and intelligent insights to give everyone the tools they need to thrive.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: "48,000+", label: "Active Users" },
                { value: "$12.4M+", label: "Debt Tracked" },
                { value: "$2.8M+", label: "Interest Saved" },
                { value: "99.4%", label: "Satisfaction Rate" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">{s.value}</p>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-darkbg-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Our Core Values</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">The principles that guide every decision we make.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <div key={i} className="bg-slate-50 dark:bg-darkbg-800 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl hover:border-brand-500/30 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 mb-4">{v.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-display mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Meet the Team</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">A passionate group of engineers, designers, and financial thinkers.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((m, i) => (
                <div key={i} className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-brand-500/10" />
                  <h3 className="font-bold text-slate-900 dark:text-white font-display">{m.name}</h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-1">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
