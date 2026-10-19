"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  TrendingDown,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Tv,
  Music,
  Gamepad2,
  BookOpen,
  Dumbbell,
  ShoppingBag,
  Zap,
  RefreshCw,
  ArrowRight,
  Info,
} from "lucide-react";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface Subscription {
  id: string;
  name: string;
  category: string;
  monthlyCost: number;
  hoursPerMonth: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  yearlyDiscount: number; // % saving if paid annually
  sharedMembers: number;
  color: string;
}

interface SubscriptionResult extends Subscription {
  costPerHour: number;
  yearlyCost: number;
  fiveYearCost: number;
  tenYearCost: number;
  perPersonCost: number;
  valueScore: number; // 0–100
  valueLabel: string;
  valueColor: string;
}

// ── PRESET SERVICES ──────────────────────────────────────────────────────────
const PRESETS = [
  { name: "Netflix Standard", category: "streaming", monthlyCost: 15.49, color: "#E50914", icon: "🎬" },
  { name: "Netflix Premium", category: "streaming", monthlyCost: 22.99, color: "#E50914", icon: "🎬" },
  { name: "Netflix with Ads", category: "streaming", monthlyCost: 7.99, color: "#E50914", icon: "🎬" },
  { name: "Disney+", category: "streaming", monthlyCost: 13.99, color: "#113CCF", icon: "🏰" },
  { name: "Hulu", category: "streaming", monthlyCost: 17.99, color: "#1CE783", icon: "📺" },
  { name: "HBO Max", category: "streaming", monthlyCost: 15.99, color: "#5822EF", icon: "🎭" },
  { name: "Amazon Prime Video", category: "streaming", monthlyCost: 8.99, color: "#00A8E0", icon: "📦" },
  { name: "Apple TV+", category: "streaming", monthlyCost: 9.99, color: "#555555", icon: "🍎" },
  { name: "Peacock", category: "streaming", monthlyCost: 7.99, color: "#000000", icon: "🦚" },
  { name: "Paramount+", category: "streaming", monthlyCost: 7.99, color: "#0064FF", icon: "⛰️" },
  { name: "Spotify Premium", category: "music", monthlyCost: 10.99, color: "#1DB954", icon: "🎵" },
  { name: "Apple Music", category: "music", monthlyCost: 10.99, color: "#FC3C44", icon: "🎵" },
  { name: "YouTube Premium", category: "streaming", monthlyCost: 13.99, color: "#FF0000", icon: "▶️" },
  { name: "Xbox Game Pass", category: "gaming", monthlyCost: 14.99, color: "#107C10", icon: "🎮" },
  { name: "PlayStation Plus", category: "gaming", monthlyCost: 14.99, color: "#003791", icon: "🎮" },
  { name: "Kindle Unlimited", category: "reading", monthlyCost: 11.99, color: "#FF9900", icon: "📚" },
  { name: "Audible", category: "reading", monthlyCost: 14.95, color: "#F8991D", icon: "🎧" },
  { name: "Duolingo Plus", category: "education", monthlyCost: 9.99, color: "#58CC02", icon: "🦉" },
  { name: "Gym Membership", category: "fitness", monthlyCost: 40, color: "#FF6B35", icon: "💪" },
  { name: "Amazon Prime", category: "shopping", monthlyCost: 14.99, color: "#FF9900", icon: "📦" },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  streaming: <Tv className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  gaming: <Gamepad2 className="w-4 h-4" />,
  reading: <BookOpen className="w-4 h-4" />,
  education: <BookOpen className="w-4 h-4" />,
  fitness: <Dumbbell className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  other: <Star className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  streaming: "text-rose-500 bg-rose-500/10 border-rose-500/30",
  music: "text-green-500 bg-green-500/10 border-green-500/30",
  gaming: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  reading: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  education: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  fitness: "text-orange-500 bg-orange-500/10 border-orange-500/30",
  shopping: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  other: "text-slate-500 bg-slate-500/10 border-slate-500/30",
};

const PALETTE = [
  "#E50914", "#1DB954", "#0064FF", "#FF9900", "#107C10",
  "#5822EF", "#FC3C44", "#FF6B35", "#58CC02", "#113CCF",
  "#00A8E0", "#003791", "#F8991D", "#1CE783", "#555555",
];

// ── VALUE SCORE CALC ─────────────────────────────────────────────────────────
function calcValueScore(costPerHour: number): { score: number; label: string; color: string } {
  if (costPerHour <= 0) return { score: 0, label: "No usage data", color: "text-slate-400" };
  if (costPerHour <= 0.5) return { score: 95, label: "Excellent Value", color: "text-emerald-500" };
  if (costPerHour <= 1.0) return { score: 80, label: "Great Value", color: "text-green-500" };
  if (costPerHour <= 2.0) return { score: 60, label: "Fair Value", color: "text-amber-500" };
  if (costPerHour <= 4.0) return { score: 35, label: "Poor Value", color: "text-orange-500" };
  return { score: 10, label: "Very Poor Value", color: "text-red-500" };
}

// ── DEFAULT SUBSCRIPTIONS ────────────────────────────────────────────────────
const DEFAULT_SUBS: Subscription[] = [
  {
    id: "1", name: "Netflix Standard", category: "streaming",
    monthlyCost: 15.49, hoursPerMonth: 40, currency: "$",
    billingCycle: "monthly", yearlyDiscount: 0, sharedMembers: 1, color: "#E50914",
  },
  {
    id: "2", name: "Spotify Premium", category: "music",
    monthlyCost: 10.99, hoursPerMonth: 60, currency: "$",
    billingCycle: "monthly", yearlyDiscount: 0, sharedMembers: 1, color: "#1DB954",
  },
];

let _idCounter = 100;
const genId = () => `sub-${++_idCounter}`;

// ── COMPONENT ────────────────────────────────────────────────────────────────
export function SubscriptionCalculator() {
  const [subs, setSubs] = useState<Subscription[]>(DEFAULT_SUBS);
  const [showPresets, setShowPresets] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState("$");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState<Partial<Subscription>>({
    name: "", category: "streaming", monthlyCost: 0, hoursPerMonth: 0,
    currency: "$", billingCycle: "monthly", yearlyDiscount: 0, sharedMembers: 1,
    color: PALETTE[0],
  });

  // ── RESULTS ──────────────────────────────────────────────────────────────
  const results: SubscriptionResult[] = useMemo(() => {
    return subs.map((s) => {
      const costPerHour = s.hoursPerMonth > 0 ? s.monthlyCost / s.hoursPerMonth : 0;
      const yearlyCost = s.monthlyCost * 12;
      const { score, label, color } = calcValueScore(costPerHour);
      const perPersonCost = s.sharedMembers > 0 ? s.monthlyCost / s.sharedMembers : s.monthlyCost;
      return {
        ...s,
        costPerHour,
        yearlyCost,
        fiveYearCost: yearlyCost * 5,
        tenYearCost: yearlyCost * 10,
        perPersonCost,
        valueScore: score,
        valueLabel: label,
        valueColor: color,
      };
    });
  }, [subs]);

  const totalMonthly = useMemo(() => results.reduce((acc, r) => acc + r.monthlyCost, 0), [results]);
  const totalYearly = totalMonthly * 12;
  const totalHours = useMemo(() => results.reduce((acc, r) => acc + r.hoursPerMonth, 0), [results]);
  const overallCPH = totalHours > 0 ? totalMonthly / totalHours : 0;
  const worstValue = results.reduce<SubscriptionResult | null>(
    (worst, r) => (r.hoursPerMonth > 0 && (!worst || r.costPerHour > worst.costPerHour) ? r : worst),
    null
  );
  const bestValue = results.reduce<SubscriptionResult | null>(
    (best, r) => (r.hoursPerMonth > 0 && (!best || r.costPerHour < best.costPerHour) ? r : best),
    null
  );

  // ── HANDLERS ─────────────────────────────────────────────────────────────
  const removeSub = (id: string) => setSubs((prev) => prev.filter((s) => s.id !== id));

  const updateSub = (id: string, patch: Partial<Subscription>) =>
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addPreset = (preset: typeof PRESETS[0]) => {
    setSubs((prev) => [
      ...prev,
      {
        id: genId(), name: preset.name, category: preset.category,
        monthlyCost: preset.monthlyCost, hoursPerMonth: 20,
        currency: globalCurrency, billingCycle: "monthly",
        yearlyDiscount: 0, sharedMembers: 1, color: preset.color,
      },
    ]);
    setShowPresets(false);
  };

  const addCustom = () => {
    if (!newSub.name?.trim()) return;
    setSubs((prev) => [
      ...prev,
      {
        id: genId(),
        name: newSub.name!,
        category: newSub.category || "other",
        monthlyCost: Number(newSub.monthlyCost) || 0,
        hoursPerMonth: Number(newSub.hoursPerMonth) || 0,
        currency: globalCurrency,
        billingCycle: newSub.billingCycle || "monthly",
        yearlyDiscount: Number(newSub.yearlyDiscount) || 0,
        sharedMembers: Number(newSub.sharedMembers) || 1,
        color: newSub.color || PALETTE[0],
      },
    ]);
    setNewSub({
      name: "", category: "streaming", monthlyCost: 0, hoursPerMonth: 0,
      currency: "$", billingCycle: "monthly", yearlyDiscount: 0, sharedMembers: 1,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    });
    setShowAddModal(false);
  };

  const fmt = (n: number) =>
    `${globalCurrency}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── PAGE HEADER ────────────────────────────────────────────────── */}
      <div className="glass-panel p-8 sm:p-10 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 text-white relative overflow-hidden rounded-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold text-xs">
              <Tv className="w-3.5 h-3.5" />
              Subscription &amp; Membership Analyzer
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Are Your Subscriptions{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                Worth It?
              </span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Add all your streaming, gaming, fitness, and membership services. See your true cost-per-hour, yearly spend,
              per-person breakdown, and a value score for each subscription — so you know exactly what to cut.
            </p>
          </div>

          {/* Currency picker */}
          <div className="glass-card p-5 bg-slate-900/80 border-slate-700/60 rounded-2xl space-y-3 min-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Currency Symbol</p>
            <div className="flex flex-wrap gap-2">
              {["$", "€", "£", "₹", "¥", "₩", "A$", "C$"].map((c) => (
                <button
                  key={c}
                  onClick={() => setGlobalCurrency(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    globalCurrency === c
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SUMMARY CARDS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Spend", value: fmt(totalMonthly), sub: `${results.length} subscriptions`, icon: DollarSign, color: "violet" },
          { label: "Yearly Spend", value: fmt(totalYearly), sub: "Total annual cost", icon: BarChart3, color: "fuchsia" },
          { label: "Total Hours / Mo", value: `${totalHours}h`, sub: "Combined usage", icon: Clock, color: "blue" },
          { label: "Blended Cost/Hour", value: overallCPH > 0 ? fmt(overallCPH) : "—", sub: "Across all services", icon: Zap, color: "amber" },
        ].map(({ label, value, sub, icon: Icon, color }) => {
          const colorMap: Record<string, string> = {
            violet: "border-l-violet-500 bg-violet-500/5",
            fuchsia: "border-l-fuchsia-500 bg-fuchsia-500/5",
            blue: "border-l-blue-500 bg-blue-500/5",
            amber: "border-l-amber-500 bg-amber-500/5",
          };
          const iconMap: Record<string, string> = {
            violet: "text-violet-500 bg-violet-500/10",
            fuchsia: "text-fuchsia-500 bg-fuchsia-500/10",
            blue: "text-blue-500 bg-blue-500/10",
            amber: "text-amber-500 bg-amber-500/10",
          };
          return (
            <div key={label} className={`glass-card p-5 rounded-2xl border-l-4 ${colorMap[color]} space-y-2`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconMap[color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{value}</div>
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
                <div className="text-[10px] text-slate-400">{sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── VALUE INSIGHTS ─────────────────────────────────────────────── */}
      {(bestValue || worstValue) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bestValue && bestValue.hoursPerMonth > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Best Value Subscription</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{bestValue.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{fmt(bestValue.costPerHour)}/hr • {bestValue.valueLabel}</p>
              </div>
            </div>
          )}
          {worstValue && worstValue.hoursPerMonth > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">Worst Value — Consider Cancelling</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{worstValue.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{fmt(worstValue.costPerHour)}/hr • {worstValue.valueLabel}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUBSCRIPTION LIST ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-900 dark:text-white">Your Subscriptions</h3>
          <div className="flex gap-2">
            <button
              id="sub-add-preset-btn"
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Quick Add
            </button>
            <button
              id="sub-add-custom-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white text-xs font-bold shadow-lg shadow-violet-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Custom
            </button>
          </div>
        </div>

        {/* Preset Panel */}
        {showPresets && (
          <div className="glass-card p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-4">
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Popular Services — Click to Add
            </p>
            {(["streaming", "music", "gaming", "reading", "fitness", "shopping"] as const).map((cat) => {
              const items = PRESETS.filter((p) => p.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 capitalize">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => addPreset(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                      >
                        <span>{p.icon}</span>
                        <span>{p.name}</span>
                        <span className="text-slate-400">{globalCurrency}{p.monthlyCost}/mo</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cards */}
        {results.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Tv className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="font-bold text-slate-500 dark:text-slate-400">No subscriptions yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "Quick Add" to add popular services or "Add Custom" for any membership</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((r) => {
            const isExpanded = expandedId === r.id;
            const catStyle = CATEGORY_COLORS[r.category] || CATEGORY_COLORS.other;

            return (
              <div
                key={r.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden transition-all"
              >
                {/* Card Header */}
                <div className="p-5 flex items-center gap-4">
                  {/* Color dot */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.name.charAt(0)}
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{r.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${catStyle} capitalize`}>
                        {r.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{fmt(r.monthlyCost)}/mo</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.hoursPerMonth}h/mo</span>
                      {r.hoursPerMonth > 0 && (
                        <span className={`flex items-center gap-1 font-semibold ${r.valueColor}`}>
                          <Zap className="w-3 h-3" />{fmt(r.costPerHour)}/hr
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Value badge */}
                  {r.hoursPerMonth > 0 && (
                    <div className="hidden sm:flex flex-col items-end shrink-0">
                      <span className={`text-xs font-black ${r.valueColor}`}>{r.valueLabel}</span>
                      <div className="mt-1 w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            r.valueScore >= 80 ? "bg-emerald-500" :
                            r.valueScore >= 60 ? "bg-amber-500" :
                            r.valueScore >= 35 ? "bg-orange-500" : "bg-red-500"
                          }`}
                          style={{ width: `${r.valueScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                      title="Edit / Expand"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeSub(r.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit + Details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700/50 p-5 space-y-6 bg-slate-50/50 dark:bg-slate-900/40">
                    {/* Edit Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Name</label>
                        <input
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                          value={r.name}
                          onChange={(e) => updateSub(r.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Monthly Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{globalCurrency}</span>
                          <input
                            type="number" min={0} step={0.01}
                            className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                            value={r.monthlyCost}
                            onChange={(e) => updateSub(r.id, { monthlyCost: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hours / Month</label>
                        <input
                          type="number" min={0}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                          value={r.hoursPerMonth}
                          onChange={(e) => updateSub(r.id, { hoursPerMonth: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Shared Members</label>
                        <input
                          type="number" min={1}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                          value={r.sharedMembers}
                          onChange={(e) => updateSub(r.id, { sharedMembers: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                        <select
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                          value={r.category}
                          onChange={(e) => updateSub(r.id, { category: e.target.value })}
                        >
                          {Object.keys(CATEGORY_ICONS).map((cat) => (
                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Color Tag</label>
                      <div className="flex flex-wrap gap-2">
                        {PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateSub(r.id, { color: c })}
                            className={`w-7 h-7 rounded-lg transition-all ${r.color === c ? "ring-2 ring-offset-2 ring-violet-500 scale-110" : "hover:scale-105"}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Cost / Hour", value: r.hoursPerMonth > 0 ? fmt(r.costPerHour) : "Enter hours", highlight: true },
                        { label: "Per Person / Mo", value: fmt(r.perPersonCost), highlight: false },
                        { label: "5-Year Total", value: fmt(r.fiveYearCost), highlight: false },
                        { label: "10-Year Total", value: fmt(r.tenYearCost), highlight: false },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                          <p className={`text-base font-black mt-1 ${highlight ? r.valueColor : "text-slate-900 dark:text-white"}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Worth it analysis */}
                    {r.hoursPerMonth > 0 && (
                      <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
                        r.valueScore >= 80
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                          : r.valueScore >= 50
                          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300"
                          : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300"
                      }`}>
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 shrink-0" />
                          <p>
                            {r.valueScore >= 80
                              ? `${r.name} is excellent value at ${fmt(r.costPerHour)}/hr. At this usage level, it's comparable to or cheaper than renting a single movie.`
                              : r.valueScore >= 50
                              ? `${r.name} is fair value at ${fmt(r.costPerHour)}/hr. Try increasing your usage to ${Math.ceil(r.monthlyCost / 1)}+ hours/month to improve the value score.`
                              : `${r.name} costs ${fmt(r.costPerHour)}/hr — more expensive than most movie rentals. Consider cancelling or increasing usage significantly.`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── YEARLY COST PROJECTION TABLE ────────────────────────────────── */}
      {results.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            Long-Term Cost Projection
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left pb-3 font-bold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="text-right pb-3 font-bold text-slate-500 uppercase tracking-wider">Monthly</th>
                  <th className="text-right pb-3 font-bold text-slate-500 uppercase tracking-wider">Yearly</th>
                  <th className="text-right pb-3 font-bold text-slate-500 uppercase tracking-wider">5 Years</th>
                  <th className="text-right pb-3 font-bold text-slate-500 uppercase tracking-wider">10 Years</th>
                  <th className="text-right pb-3 font-bold text-slate-500 uppercase tracking-wider">Cost/Hr</th>
                  <th className="text-right pb-3 font-bold text-slate-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                        <span className="font-semibold text-slate-900 dark:text-white">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-slate-700 dark:text-slate-300">{fmt(r.monthlyCost)}</td>
                    <td className="py-3 text-right text-slate-700 dark:text-slate-300">{fmt(r.yearlyCost)}</td>
                    <td className="py-3 text-right font-semibold text-slate-700 dark:text-slate-300">{fmt(r.fiveYearCost)}</td>
                    <td className="py-3 text-right font-bold text-slate-900 dark:text-white">{fmt(r.tenYearCost)}</td>
                    <td className="py-3 text-right">
                      <span className={`font-bold ${r.hoursPerMonth > 0 ? r.valueColor : "text-slate-400"}`}>
                        {r.hoursPerMonth > 0 ? fmt(r.costPerHour) : "—"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-black ${r.valueColor}`}>
                        {r.hoursPerMonth > 0 ? r.valueLabel : "Add hours"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-600">
                  <td className="pt-3 font-black text-slate-900 dark:text-white">TOTAL</td>
                  <td className="pt-3 text-right font-black text-violet-600 dark:text-violet-400">{fmt(totalMonthly)}</td>
                  <td className="pt-3 text-right font-black text-violet-600 dark:text-violet-400">{fmt(totalYearly)}</td>
                  <td className="pt-3 text-right font-black text-violet-600 dark:text-violet-400">{fmt(totalYearly * 5)}</td>
                  <td className="pt-3 text-right font-black text-violet-600 dark:text-violet-400">{fmt(totalYearly * 10)}</td>
                  <td className="pt-3 text-right font-black text-slate-700 dark:text-slate-300">
                    {overallCPH > 0 ? fmt(overallCPH) : "—"}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── ADD CUSTOM MODAL ─────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Add Custom Subscription</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Service Name *</label>
                <input
                  placeholder="e.g. Crunchyroll, NYT, LinkedIn Premium"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  value={newSub.name || ""}
                  onChange={(e) => setNewSub((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Monthly Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{globalCurrency}</span>
                    <input
                      type="number" min={0} step={0.01} placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      value={newSub.monthlyCost || ""}
                      onChange={(e) => setNewSub((p) => ({ ...p, monthlyCost: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Hours / Month</label>
                  <input
                    type="number" min={0} placeholder="e.g. 30"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    value={newSub.hoursPerMonth || ""}
                    onChange={(e) => setNewSub((p) => ({ ...p, hoursPerMonth: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    value={newSub.category}
                    onChange={(e) => setNewSub((p) => ({ ...p, category: e.target.value }))}
                  >
                    {Object.keys(CATEGORY_ICONS).map((cat) => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Shared Members</label>
                  <input
                    type="number" min={1} placeholder="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    value={newSub.sharedMembers || 1}
                    onChange={(e) => setNewSub((p) => ({ ...p, sharedMembers: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Color Tag</label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewSub((p) => ({ ...p, color: c }))}
                      className={`w-8 h-8 rounded-lg transition-all ${newSub.color === c ? "ring-2 ring-offset-2 ring-violet-500 scale-110" : "hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCustom}
                disabled={!newSub.name?.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-black text-sm shadow-lg shadow-violet-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
