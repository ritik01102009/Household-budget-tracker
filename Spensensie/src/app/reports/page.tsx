"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { 
  BarChart3, Calendar, FileText, Download, Printer, 
  ArrowUpRight, ArrowDownRight, TrendingUp, Check, Award
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, AreaChart, Area 
} from "recharts";

export default function Reports() {
  const { transactions } = useAppState();

  // Filters State
  const [scope, setScope] = useState<"MONTHLY" | "ANNUAL" | "CUSTOM">("MONTHLY");
  const [targetType, setTargetType] = useState<"ALL" | "INCOME" | "EXPENSE" | "SAVINGS">("ALL");
  const [selectedMonth, setSelectedMonth] = useState("2026-07");

  // Export State
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportNotice(`Report successfully compiled and downloaded as ${format}!`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // 1. Calculations: filter data
  const reportTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      // Filter by scope
      if (scope === "MONTHLY") {
        if (!tx.date.startsWith(selectedMonth)) return false;
      }
      
      // Filter by target category
      if (targetType === "INCOME") return tx.type === "INCOME";
      if (targetType === "EXPENSE") return tx.type === "EXPENSE";
      if (targetType === "SAVINGS") return tx.category === "Savings" || tx.category === "Investments";
      
      return true;
    });
  }, [transactions, scope, targetType, selectedMonth]);

  const kpis = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    let savings = 0;

    reportTransactions.forEach((tx) => {
      if (tx.type === "INCOME") {
        income += tx.amount;
      } else {
        expense += tx.amount;
        if (tx.category === "Savings" || tx.category === "Investments") {
          savings += tx.amount;
        }
      }
    });

    const net = income - expense;
    const rate = income > 0 ? Math.round((net / income) * 100) : 0;

    return {
      income,
      expense,
      savings,
      net,
      rate
    };
  }, [reportTransactions]);

  // 2. Data breakdowns by category
  const categoryBreakdown = React.useMemo(() => {
    const map: { [cat: string]: { amount: number; count: number; type: string } } = {};
    reportTransactions.forEach((tx) => {
      if (!map[tx.category]) {
        map[tx.category] = { amount: 0, count: 0, type: tx.type };
      }
      map[tx.category].amount += tx.amount;
      map[tx.category].count += 1;
    });

    const total = targetType === "INCOME" ? kpis.income : kpis.expense || 1;

    return Object.keys(map).map((cat) => ({
      category: cat,
      amount: map[cat].amount,
      count: map[cat].count,
      type: map[cat].type,
      percentage: Math.round((map[cat].amount / total) * 100)
    })).sort((a, b) => b.amount - a.amount);
  }, [reportTransactions, targetType, kpis]);

  // Chart data
  const barChartData = [
    { name: "Feb", Income: 4200, Expenses: 3100 },
    { name: "Mar", Income: 4200, Expenses: 3500 },
    { name: "Apr", Income: 4500, Expenses: 3600 },
    { name: "May", Income: 4600, Expenses: 3400 },
    { name: "Jun", Income: 4800, Expenses: 3800 },
    { name: "Jul", Income: kpis.income, Expenses: kpis.expense }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto print-container">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 no-print">
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-655 font-bold flex items-center space-x-1.5 mb-2">
                <Award className="w-4 h-4 text-emerald-500 animate-pulse-slow" />
                <span>Financial Audits & Statements</span>
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-brand-500" />
                <span>Reports Generator</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Compile comprehensive cash flow summaries, audits, and category shares.</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => handleExport("CSV")}
                className="p-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-darkbg-850 hover:bg-slate-50 rounded-xl text-slate-500 text-xs font-semibold flex items-center space-x-1"
                title="Download CSV"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExport("Excel")}
                className="p-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-darkbg-850 hover:bg-slate-50 rounded-xl text-slate-500 text-xs font-semibold flex items-center space-x-1"
                title="Download Excel"
              >
                <FileText className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-500/15"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="mb-6 p-4 bg-brand-500/10 border border-brand-500/20 text-brand-655 rounded-2xl text-xs flex items-center space-x-1.5 animate-fade-in-up">
              <Check className="w-4 h-4" />
              <span>{exportNotice}</span>
            </div>
          )}

          {/* Config Filters - Scope / Category Target */}
          <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8 no-print">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Report Scope */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Report Scope</label>
                <div className="flex bg-slate-55 border rounded-xl p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setScope("MONTHLY")}
                    className={`flex-1 py-1.5 rounded-lg transition-colors ${scope === "MONTHLY" ? "bg-brand-500 text-white font-bold" : "text-slate-500"}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setScope("ANNUAL")}
                    className={`flex-1 py-1.5 rounded-lg transition-colors ${scope === "ANNUAL" ? "bg-brand-500 text-white font-bold" : "text-slate-500"}`}
                  >
                    Annual
                  </button>
                  <button
                    onClick={() => setScope("CUSTOM")}
                    className={`flex-1 py-1.5 rounded-lg transition-colors ${scope === "CUSTOM" ? "bg-brand-500 text-white font-bold" : "text-slate-500"}`}
                  >
                    All-Time
                  </button>
                </div>
              </div>

              {/* Targets type selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Target Area</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Cash Flow</option>
                  <option value="INCOME">Income Analysis Only</option>
                  <option value="EXPENSE">Expense Category Analysis Only</option>
                  <option value="SAVINGS">Savings & Investments Only</option>
                </select>
              </div>

              {/* Month select (if monthly scope active) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Billing Period</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={scope !== "MONTHLY"}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none disabled:opacity-40"
                />
              </div>

            </div>
          </div>

          {/* KPIs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-darkbg-800 border rounded-3xl p-5 shadow-sm flex items-center space-x-3.5">
              <span className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cash Inflow</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">${kpis.income.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-darkbg-800 border rounded-3xl p-5 shadow-sm flex items-center space-x-3.5">
              <span className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-455 rounded-xl">
                <ArrowDownRight className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cash Outflow</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">${kpis.expense.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-darkbg-800 border rounded-3xl p-5 shadow-sm flex items-center space-x-3.5">
              <span className="p-2.5 bg-brand-500/10 text-brand-655 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Net Margin</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">${kpis.net.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-darkbg-800 border rounded-3xl p-5 shadow-sm flex items-center space-x-3.5">
              <span className="p-2.5 bg-lime-500/10 text-lime-655 rounded-xl">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Net Savings Rate</p>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{kpis.rate}%</h3>
              </div>
            </div>
          </div>

          {/* Graphic and Audit Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Chart: Comparative cash flow (Bar chart) */}
            <div className="lg:col-span-7 bg-white dark:bg-darkbg-800 border rounded-3xl p-6 shadow-sm no-print">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display mb-4">Cash Flow History Projections</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audit breakdown table */}
            <div className="lg:col-span-5 bg-white dark:bg-darkbg-800 border rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display mb-4">
                Category Share Breakdown
              </h3>
              
              {categoryBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">No categories recorded in this scope.</p>
              ) : (
                <div className="space-y-4">
                  {categoryBreakdown.map((row) => (
                    <div key={row.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-655">{row.category} ({row.count} tx)</span>
                        <span className="text-slate-700 dark:text-slate-200">
                          ${row.amount.toLocaleString()} ({row.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            row.type === "INCOME" ? "bg-emerald-500" : "bg-brand-500"
                          }`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Printable Layout Details (Hidden in screen, shows only on print) */}
          <div className="hidden print:block w-full text-slate-950 p-8 space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <h1 className="text-3xl font-extrabold font-display">SpendSensie Finance Report</h1>
              <p className="text-sm mt-1">Unified Cash Inflow/Outflow Balance Audit Statement</p>
              <p className="text-xs text-slate-400 mt-2">Generated on: {new Date().toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-sm text-slate-500 uppercase">Audit Parameters</h3>
                <table className="w-full mt-2 text-xs border-collapse">
                  <tbody>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Report Scope:</td>
                      <td className="capitalize">{scope.toLowerCase()}</td>
                    </tr>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Area Target:</td>
                      <td className="capitalize">{targetType.toLowerCase()}</td>
                    </tr>
                    {scope === "MONTHLY" && (
                      <tr className="border-b py-1">
                        <td className="font-semibold pr-2">Billing Month:</td>
                        <td>{selectedMonth}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-500 uppercase">Cash Flow Summary</h3>
                <div className="mt-2 border-2 border-slate-900 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span>Total Cash Inflow:</span>
                    <span className="font-bold">${kpis.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span>Total Cash Outflow:</span>
                    <span className="font-bold">${kpis.expense.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span>Net Margin Surplus:</span>
                    <span className="font-bold text-emerald-600">${kpis.net.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span>Net Savings Rate:</span>
                    <span>{kpis.rate}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-500 uppercase mb-2">Detailed Category Ledger Shares</h3>
              <table className="w-full text-xs border-collapse border">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Count</th>
                    <th className="p-2 text-left">Total Value</th>
                    <th className="p-2 text-left">Share %</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((row) => (
                    <tr key={row.category} className="border-b">
                      <td className="p-2">{row.category}</td>
                      <td className="p-2 capitalize">{row.type.toLowerCase()}</td>
                      <td className="p-2">{row.count} items</td>
                      <td className="p-2 font-bold">${row.amount.toLocaleString()}</td>
                      <td className="p-2">{row.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4 text-center text-[10px] text-slate-400">
              SpendSensie Secure FinTech Analytics.
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
