"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Shield, Heart, Sparkles, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const navSections = [
    {
      title: "Solutions",
      links: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/budget", label: "Budget Tracker" },
        { href: "/goals", label: "Savings Goals" },
        { href: "/reports", label: "Financial Reports" }
      ]
    },
    {
      title: "Calculators",
      links: [
        { href: "/calculators/membership", label: "Membership Fees" },
        { href: "/calculators/debt", label: "Debt Payoff (Snowball)" },
        { href: "/tools", label: "SIP & Mortgage Tools" },
        { href: "/tools", label: "12+ Financial Widgets" }
      ]
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/blog", label: "Finance Blog" },
        { href: "/contact", label: "Contact & Map" },
        { href: "/", label: "Security & Trust" }
      ]
    }
  ];

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Panel */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-limebrand-400 text-white font-bold">
                SS
              </span>
              <span className="font-bold text-lg font-display tracking-tight text-white">
                SpendSensie
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Take complete command of your capital. SpendSensie is a premium, secure financial intelligence platform helping you save interest, budget intelligently, and grow wealth.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>AES-256 local encrypted sandbox environment.</span>
            </div>
          </div>

          {/* Nav Categories */}
          {navSections.map((sec) => (
            <div key={sec.title} className="lg:col-span-1">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                {sec.title}
              </h3>
              <ul className="space-y-2.5">
                {sec.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter subscription */}
          <div className="lg:col-span-1 md:col-span-2">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Get weekly micro-lessons on investing, budgeting, and debt-free living.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-11 px-4 pr-12 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 w-9 h-9 flex items-center justify-center bg-brand-600 rounded-lg text-white hover:bg-brand-500 transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <div className="mt-3 flex items-center space-x-1.5 text-xs text-brand-400 animate-fade-in-up">
                <Sparkles className="w-4 h-4" />
                <span>Subscription successful! Welcome aboard.</span>
              </div>
            )}
          </div>
        </div>

        {/* Lower Banner */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SpendSensie. All rights reserved. Built for financial freedom.
          </p>
          <div className="flex items-center space-x-1.5">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for users seeking financial growth.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
