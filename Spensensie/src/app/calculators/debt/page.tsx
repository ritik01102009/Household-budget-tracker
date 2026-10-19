"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { 
  Calculator, Plus, Trash2, ArrowRight, Printer, Save, Check,
  TrendingDown, TrendingUp, Info, HelpCircle, FileText, ChevronRight, BarChart3, Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { motion } from "framer-motion";

interface Debt {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

export default function DebtPayoffCalculator() {
  const { saveCalculation, savedCalculations, deleteCalculation, user } = useAppState();

  // Initial Debt List state
  const [debts, setDebts] = useState<Debt[]>([
    { id: "d-1", name: "Credit Card A", balance: 4500, apr: 18.9, minPayment: 130 },
    { id: "d-2", name: "Car Loan", balance: 12000, apr: 6.5, minPayment: 280 },
    { id: "d-3", name: "Student Loan", balance: 18000, apr: 4.8, minPayment: 210 }
  ]);

  // Form states for adding a debt
  const [newDebtName, setNewDebtName] = useState("");
  const [newDebtBalance, setNewDebtBalance] = useState<number | "">("");
  const [newDebtApr, setNewDebtApr] = useState<number | "">("");
  const [newDebtMin, setNewDebtMin] = useState<number | "">("");

  // Extra payment state
  const [extraPayment, setExtraPayment] = useState(300);
  const [startDate, setStartDate] = useState("2026-07-01");

  // Save/Share statuses
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add a new debt
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtName || !newDebtBalance || !newDebtApr || !newDebtMin) return;

    const debt: Debt = {
      id: "d-" + Math.random().toString(36).substr(2, 9),
      name: newDebtName,
      balance: Number(newDebtBalance),
      apr: Number(newDebtApr),
      minPayment: Number(newDebtMin)
    };

    setDebts([...debts, debt]);
    setNewDebtName("");
    setNewDebtBalance("");
    setNewDebtApr("");
    setNewDebtMin("");
  };

  // Delete a debt
  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  // Run Amortization Simulation
  const simulations = useMemo(() => {
    if (debts.length === 0) return null;

    const runSimulation = (strategy: "SNOWBALL" | "AVALANCHE" | "MINIMUMS") => {
      // Deep copy debts
      let activeDebts = debts.map((d) => ({ ...d, currentBalance: d.balance, interestPaid: 0 }));
      
      // Sort debts based on strategy
      if (strategy === "SNOWBALL") {
        activeDebts.sort((a, b) => a.balance - b.balance);
      } else if (strategy === "AVALANCHE") {
        activeDebts.sort((a, b) => b.apr - a.apr);
      }

      let totalInterest = 0;
      let monthSnapshots: any[] = [];
      let totalAmountPaid = 0;
      let monthIndex = 0;

      // Ensure user is paying enough to cover monthly interest at least
      const totalMinPaymentNeeded = debts.reduce((sum, d) => sum + d.minPayment, 0);
      const monthlyBudget = strategy === "MINIMUMS" ? totalMinPaymentNeeded : totalMinPaymentNeeded + extraPayment;

      // Simulate month-by-month
      while (monthIndex < 360) { // 30 year limit
        const activeDebtItems = activeDebts.filter((d) => d.currentBalance > 0);
        if (activeDebtItems.length === 0) break;

        monthIndex++;
        let leftoverFunds = monthlyBudget;
        let monthlyInterestThisMonth = 0;
        let startingBalances = activeDebts.map(d => ({ id: d.id, val: d.currentBalance }));

        // 1. Accrue Interest
        activeDebts.forEach((debt) => {
          if (debt.currentBalance > 0) {
            const interest = (debt.currentBalance * (debt.apr / 100)) / 12;
            debt.currentBalance += interest;
            debt.interestPaid += interest;
            monthlyInterestThisMonth += interest;
            totalInterest += interest;
          }
        });

        let totalBalanceBeforePayments = activeDebts.reduce((sum, d) => sum + d.currentBalance, 0);

        // 2. Pay minimums
        activeDebts.forEach((debt) => {
          if (debt.currentBalance > 0) {
            const payment = Math.min(debt.minPayment, debt.currentBalance);
            debt.currentBalance -= payment;
            leftoverFunds -= payment;
            totalAmountPaid += payment;
          }
        });

        // 3. Apply Extra / Leftover Rollover to Target Debt
        if (strategy !== "MINIMUMS" && leftoverFunds > 0) {
          // Re-sort current items if snowball/avalanche (target the first active debt in the sorted sequence)
          const targetDebts = activeDebts.filter((d) => d.currentBalance > 0);
          if (targetDebts.length > 0) {
            // Apply all leftover to the first target debt
            const target = targetDebts[0];
            const extraApplied = Math.min(leftoverFunds, target.currentBalance);
            target.currentBalance -= extraApplied;
            totalAmountPaid += extraApplied;
          }
        }

        const endingTotalBalance = activeDebts.reduce((sum, d) => sum + d.currentBalance, 0);

        monthSnapshots.push({
          month: monthIndex,
          balance: Math.round(endingTotalBalance),
          interestPaidThisMonth: Math.round(monthlyInterestThisMonth),
          totalPaidThisMonth: Math.round(monthlyBudget)
        });

        if (endingTotalBalance <= 0) break;
      }

      return {
        snapshots: monthSnapshots,
        totalInterest: Math.round(totalInterest),
        totalPaid: Math.round(totalAmountPaid),
        months: monthIndex,
        success: monthIndex < 360
      };
    };

    const snowball = runSimulation("SNOWBALL");
    const avalanche = runSimulation("AVALANCHE");
    const minimums = runSimulation("MINIMUMS");

    // Format chart data (combine snowball and avalanche lists)
    const maxMonths = Math.max(snowball.months, avalanche.months, minimums.months);
    const chartData: any[] = [];

    for (let m = 0; m <= Math.min(maxMonths, 120); m += 2) {
      const getBalance = (sim: any, idx: number) => {
        if (idx === 0) return debts.reduce((sum, d) => sum + d.balance, 0);
        const match = sim.snapshots.find((s: any) => s.month === idx);
        if (match) return match.balance;
        return idx > sim.months ? 0 : null;
      };

      chartData.push({
        name: `M${m}`,
        Snowball: getBalance(snowball, m),
        Avalanche: getBalance(avalanche, m),
        Minimums: getBalance(minimums, m)
      });
    }

    return {
      snowball,
      avalanche,
      minimums,
      chartData
    };
  }, [debts, extraPayment]);

  // Strategy comparative values
  const totalPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);
  const minPaymentsTotal = debts.reduce((sum, d) => sum + d.minPayment, 0);
  const monthlyDebtBudget = minPaymentsTotal + extraPayment;

  const candleChartData = debts
    .slice()
    .sort((a, b) => b.apr - a.apr)
    .map((debt) => ({
      name: debt.name,
      balance: debt.balance,
      apr: debt.apr,
      monthlyInterest: Math.round((debt.balance * debt.apr) / 100 / 12)
    }));

  const preferredStrategy = simulations
    ? simulations.avalanche.totalInterest <= simulations.snowball.totalInterest
      ? "Avalanche"
      : "Snowball"
    : "Avalanche";
  const strategySavings = simulations
    ? Math.abs(simulations.minimums.totalInterest - simulations.avalanche.totalInterest)
    : 0;
  const strategyMonthsSaved = simulations
    ? Math.max(0, simulations.minimums.months - simulations.avalanche.months)
    : 0;
  const targetDebt = debts.length > 0 ? debts.slice().sort((a, b) => b.apr - a.apr)[0] : null;

  const handlePrintReport = () => {
    document.body.dataset.date = new Date().toLocaleString();
    window.print();
  };

  // Amortization list to draw
  const [selectedAmortizationTab, setSelectedAmortizationTab] = useState<"AVALANCHE" | "SNOWBALL">("AVALANCHE");

  // Save Config
  const handleSaveConfig = () => {
    saveCalculation({
      type: "DEBT",
      title: "My Debt Repayment Plan",
      details: {
        debts,
        extraPayment,
        simulations
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const mySaves = savedCalculations.filter((c) => c.type === "DEBT");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto print-container">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 no-print">
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-655 font-bold flex items-center space-x-1.5 mb-2">
                <TrendingDown className="w-4 h-4 text-emerald-500 animate-pulse-slow" />
                <span>Debt Elimination Engine</span>
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center space-x-2">
                <Calculator className="w-8 h-8 text-brand-500" />
                <span>Debt Payoff Calculator</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Accelerate financial wellness. Simulate Snowball vs Avalanche schedules side-by-side.</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-500/15"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Plan Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Plan</span>
                  </>
                )}
              </button>
              <button
                onClick={handlePrintReport}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-sm font-semibold flex items-center space-x-2 text-slate-750 dark:text-slate-250"
              >
                <Printer className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Panel: Manage Debts & Extra Allocation */}
            <div className="lg:col-span-6 space-y-6 no-print">
              
              {/* Debt Add Form & List */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  1. Manage Debts
                </h3>

                <form onSubmit={handleAddDebt} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500">Debt Name</label>
                    <input
                      type="text"
                      value={newDebtName}
                      onChange={(e) => setNewDebtName(e.target.value)}
                      placeholder="e.g. Visa Credit Card"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Remaining Balance ($)</label>
                    <input
                      type="number"
                      value={newDebtBalance}
                      onChange={(e) => setNewDebtBalance(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 5000"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Annual APR (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newDebtApr}
                      onChange={(e) => setNewDebtApr(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 17.5"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Min. Monthly Payment ($)</label>
                    <input
                      type="number"
                      value={newDebtMin}
                      onChange={(e) => setNewDebtMin(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 150"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Debt</span>
                    </button>
                  </div>
                </form>

                {/* Debts Table list */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Current Debts ({debts.length})</h4>
                  {debts.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">No debts added yet. Fill out the form above.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {debts.map((d) => (
                        <div 
                          key={d.id} 
                          className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs hover:border-brand-500/20"
                        >
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{d.name}</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">APR: <span className="font-semibold text-slate-655">{d.apr}%</span> | Min: <span className="font-semibold text-slate-655">${d.minPayment}/mo</span></p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">${d.balance.toLocaleString()}</span>
                            <button
                              onClick={() => handleDeleteDebt(d.id)}
                              className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/20 text-rose-500 rounded-lg"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {debts.length > 0 && (
                    <div className="pt-3 border-t border-slate-150 dark:border-slate-800 flex justify-between text-xs font-bold text-slate-500">
                      <span>Total Principal Balance:</span>
                      <span className="text-slate-950 dark:text-white text-sm">${totalPrincipal.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Payoff Budgets slider */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  2. Accelerate Payoff
                </h3>

                <div className="space-y-6">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-500">Extra Monthly Contribution</span>
                    <span className="text-brand-655">${extraPayment} / Month</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="50"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/5 border border-brand-500/20 rounded-2xl text-xs text-brand-700 dark:text-brand-400 flex items-start space-x-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">
                      This extra payment will be added on top of your total debt minimum payments (which total <span className="font-bold">${minPaymentsTotal}</span>/mo), bringing your total monthly debt repayment budget to <span className="font-bold">${minPaymentsTotal + extraPayment}</span>/mo.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Panel: Simulation Outcomes & Visual Graphs */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Comparative Projections Dashboard */}
              {simulations && (
                <div className="glass-card-premium rounded-3xl p-6 border border-white/20 dark:border-slate-800 shadow-lg relative overflow-hidden">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-5 pb-3 border-b border-slate-100 dark:border-slate-800 no-print">
                    Payoff Projections Comparison
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Minimums */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-3 rounded-2xl text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Minimums Only</p>
                      <p className="text-base font-bold mt-1 text-slate-700 dark:text-slate-200">{simulations.minimums.months} months</p>
                      <p className="text-[9px] text-slate-400 mt-1">Interest: ${simulations.minimums.totalInterest.toLocaleString()}</p>
                    </div>

                    {/* Snowball */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-3 rounded-2xl text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Snowball Strategy</p>
                      <p className="text-base font-bold mt-1 text-slate-700 dark:text-slate-200">{simulations.snowball.months} months</p>
                      <p className="text-[9px] text-slate-400 mt-1">Interest: ${simulations.snowball.totalInterest.toLocaleString()}</p>
                    </div>

                    {/* Avalanche */}
                    <div className="bg-brand-500/10 dark:bg-brand-500/5 border border-brand-500/20 p-3 rounded-2xl text-center">
                      <p className="text-[10px] text-brand-655 font-bold uppercase tracking-wider flex items-center justify-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse-slow" />
                        <span>Avalanche (Best)</span>
                      </p>
                      <p className="text-base font-bold mt-1 text-brand-600 dark:text-brand-400">{simulations.avalanche.months} months</p>
                      <p className="text-[9px] text-brand-500 mt-1">Interest: ${simulations.avalanche.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Summary Comparison box */}
                  <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 font-display">Optimization Impact (Avalanche vs Minimums):</h4>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Interest Saved:</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400">${strategySavings.toLocaleString()} saved</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Months Saved:</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400">{strategyMonthsSaved} months earlier</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recommended Strategy:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{preferredStrategy} payoff</span>
                    </div>
                  </div>

                  <div className="mt-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-3xl p-5">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Payoff Recommendation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Focus your next payment on {targetDebt ? <strong>{targetDebt.name}</strong> : 'the highest APR debt'} first. Maintain a total monthly repayment budget of <strong>${monthlyDebtBudget.toLocaleString()}</strong> to keep your plan on pace.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                      <li>Use the {preferredStrategy} strategy to attack {targetDebt ? targetDebt.name : 'high-cost debt'} first.</li>
                      <li>Keep at least ${minPaymentsTotal.toLocaleString()} to cover minimum obligations.</li>
                      <li>Apply ${extraPayment.toLocaleString()} extra per month as a payoff accelerator.</li>
                    </ul>
                  </div>

                  <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-3xl p-5">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Debt Candle Summary</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={candleChartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Bar dataKey="balance" radius={[8, 8, 0, 0]}>
                            {candleChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.apr >= 15 ? '#16a34a' : '#34d399'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Visual Chart Projections */}
                  <div className="mt-6 h-60 w-full no-print">
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Balance Timeline</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simulations.chartData}>
                        <defs>
                          <linearGradient id="colorSnowball" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAvalanche" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#84CC16" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#84CC16" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip />
                        <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="Minimums" stroke="#94A3B8" strokeWidth={1.5} fill="none" activeDot={{ r: 4 }} />
                        <Area type="monotone" dataKey="Snowball" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSnowball)" />
                        <Area type="monotone" dataKey="Avalanche" stroke="#84CC16" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAvalanche)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Saved debt calculations list */}
              {mySaves.length > 0 && (
                <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm no-print">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display mb-4">
                    Saved Repayment Targets
                  </h3>
                  <div className="space-y-2">
                    {mySaves.map((save) => (
                      <div key={save.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{save.title}</p>
                          <p className="text-[10px] text-slate-400">Extra: <span className="font-bold">${save.details.extraPayment}/mo</span> | Debts: {save.details.debts.length}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setDebts(save.details.debts);
                              setExtraPayment(save.details.extraPayment);
                            }}
                            className="text-brand-655 font-bold hover:underline"
                          >
                            Load
                          </button>
                          <button onClick={() => deleteCalculation(save.id)} className="text-rose-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Full Amortization Month-by-month Schedule Table */}
          {simulations && (
            <div className="mt-8 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm no-print">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-850">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display flex items-center space-x-1.5">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span>3. Amortization Schedule</span>
                </h3>
                <div className="flex mt-3 sm:mt-0 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setSelectedAmortizationTab("AVALANCHE")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${selectedAmortizationTab === "AVALANCHE" ? "bg-brand-500 text-white" : "text-slate-500"}`}
                  >
                    Avalanche Payoff Log
                  </button>
                  <button
                    onClick={() => setSelectedAmortizationTab("SNOWBALL")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${selectedAmortizationTab === "SNOWBALL" ? "bg-brand-500 text-white" : "text-slate-500"}`}
                  >
                    Snowball Payoff Log
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto border rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b">
                      <th className="p-3 font-semibold">Month</th>
                      <th className="p-3 font-semibold">Remaining Balance</th>
                      <th className="p-3 font-semibold">Monthly Interest Accrued</th>
                      <th className="p-3 font-semibold">Allocated Repayment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedAmortizationTab === "AVALANCHE" ? simulations.avalanche : simulations.snowball).snapshots.map((snap: any) => (
                      <tr key={snap.month} className="border-b dark:border-slate-850 text-slate-600 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-3 font-semibold">Month {snap.month}</td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">${snap.balance.toLocaleString()}</td>
                        <td className="p-3 text-rose-500">${snap.interestPaidThisMonth.toLocaleString()}</td>
                        <td className="p-3 text-emerald-500 font-semibold">${snap.totalPaidThisMonth.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Printable Layout Details (Hidden in screen, shows only on print) */}
          {simulations && (
            <div className="hidden print:block w-full text-slate-950 p-8 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h1 className="text-3xl font-extrabold font-display">SpendSensie Finance Report</h1>
                <p className="text-sm mt-1">Accelerated Debt Repayment & Eliminations Audit</p>
                <p className="text-xs text-slate-400 mt-2">Generated on: {new Date().toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-500 uppercase">Debts Profile</h3>
                <table className="w-full mt-2 text-xs border-collapse border">
                  <thead>
                    <tr className="bg-slate-100 border-b">
                      <th className="p-2 text-left">Debt Item</th>
                      <th className="p-2 text-left">Balance</th>
                      <th className="p-2 text-left">APR %</th>
                      <th className="p-2 text-left">Minimum Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debts.map((d) => (
                      <tr key={d.id} className="border-b">
                        <td className="p-2">{d.name}</td>
                        <td className="p-2 font-bold">${d.balance}</td>
                        <td className="p-2">{d.apr}%</td>
                        <td className="p-2">${d.minPayment}/mo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-500 uppercase">Elimination Strategy Side-by-side</h3>
                  <table className="w-full mt-2 text-xs border-collapse">
                    <tbody>
                      <tr className="border-b py-1">
                        <td className="font-semibold pr-2">Total Principal:</td>
                        <td>${totalPrincipal.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b py-1">
                        <td className="font-semibold pr-2">Minimum Payment Total:</td>
                        <td>${minPaymentsTotal}/mo</td>
                      </tr>
                      <tr className="border-b py-1">
                        <td className="font-semibold pr-2">Extra Added Contribution:</td>
                        <td>${extraPayment}/mo</td>
                      </tr>
                      <tr className="border-b py-1">
                        <td className="font-semibold pr-2">Minimums Payoff Time:</td>
                        <td>{simulations.minimums.months} Months (Interest: ${simulations.minimums.totalInterest.toLocaleString()})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-500 uppercase">Rollover Acceleration Outcomes</h3>
                  <div className="mt-2 border-2 border-brand-500 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between border-b pb-1 text-xs">
                      <span>Avalanche payoff duration:</span>
                      <span className="font-bold">{simulations.avalanche.months} Months</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 text-xs">
                      <span>Snowball payoff duration:</span>
                      <span className="font-bold">{simulations.snowball.months} Months</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 text-xs text-brand-600 font-bold">
                      <span>Total Savings (Avalanche):</span>
                      <span>${(simulations.minimums.totalInterest - simulations.avalanche.totalInterest).toLocaleString()} Saved</span>
                    </div>
                    <div className="flex justify-between text-xs text-brand-600 font-bold">
                      <span>Repayment Time Saved:</span>
                      <span>{simulations.minimums.months - simulations.avalanche.months} Months earlier</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 text-center text-[10px] text-slate-400">
                SpendSensie Secure FinTech Analytics - Prepared for {user?.name || "Member"}.
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
