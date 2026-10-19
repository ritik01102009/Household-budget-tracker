"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Calculator, DollarSign, TrendingUp, PiggyBank, Briefcase, Percent, 
  MapPin, Shield, RefreshCw, Key, Landmark, Users, CreditCard, Layers, Printer
} from "lucide-react";
import PrintButton from "@/components/ui/PrintButton";
import { motion } from "framer-motion";

export default function FinancialTools() {
  // Selected Tool state
  const [activeTool, setActiveTool] = useState<string>("emi");

  // Tool directory
  const toolList = [
    { id: "emi", label: "EMI Calculator", icon: <CreditCard className="w-5 h-5 text-emerald-500" />, desc: "Monthly loan repayment estimator." },
    { id: "loan", label: "Loan Calculator", icon: <Landmark className="w-5 h-5 text-lime-500" />, desc: "Detailed interest and repayment totals." },
    { id: "mortgage", label: "Mortgage Calculator", icon: <Landmark className="w-5 h-5 text-emerald-500" />, desc: "Taxes and insurance home mortgage solver." },
    { id: "sip", label: "SIP Calculator", icon: <TrendingUp className="w-5 h-5 text-lime-500" />, desc: "Systematic Investment Plan compounder." },
    { id: "investment", label: "Lumpsum Calculator", icon: <Briefcase className="w-5 h-5 text-emerald-500" />, desc: "One-time lump sum growth simulator." },
    { id: "retirement", label: "Retirement Planner", icon: <Users className="w-5 h-5 text-lime-500" />, desc: "Nest-egg planning and longevity." },
    { id: "compound", label: "Compound Interest", icon: <Percent className="w-5 h-5 text-emerald-500" />, desc: "General compounding frequency solver." },
    { id: "savings", label: "Savings Goal Solver", icon: <PiggyBank className="w-5 h-5 text-lime-500" />, desc: "Required monthly contribution planner." },
    { id: "tax", label: "Tax Slab Calculator", icon: <Layers className="w-5 h-5 text-emerald-500" />, desc: "Progressive bracket income tax estimator." },
    { id: "networth", label: "Net Worth Calculator", icon: <Shield className="w-5 h-5 text-lime-500" />, desc: "Assets vs Liabilities calculator." },
    { id: "emergency", label: "Emergency Fund", icon: <Key className="w-5 h-5 text-emerald-500" />, desc: "Safety multipliers expense planner." },
    { id: "currency", label: "Currency Converter", icon: <RefreshCw className="w-5 h-5 text-lime-500" />, desc: "Simulated currency exchange converter." }
  ];

  // WIDGET 1: EMI Calculator States
  const [emiPrincipal, setEmiPrincipal] = useState(10000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(36); // months

  const calculateEMI = () => {
    const P = emiPrincipal;
    const r = emiRate / 12 / 100;
    const N = emiTenure;
    if (r === 0) return { emi: P / N, totalInterest: 0, totalPayment: P };
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) };
  };
  const emiVal = calculateEMI();

  // WIDGET 2: Loan Calculator States
  const [loanAmt, setLoanAmt] = useState(25000);
  const [loanRate, setLoanRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(5);

  const calculateLoan = () => {
    const P = loanAmt;
    const r = loanRate / 12 / 100;
    const N = loanYears * 12;
    if (r === 0) return { emi: P / N, totalInterest: 0, totalPayment: P };
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) };
  };
  const loanVal = calculateLoan();

  // WIDGET 3: Mortgage Calculator States
  const [mHomePrice, setMHomePrice] = useState(350000);
  const [mDownPayment, setMDownPayment] = useState(70000);
  const [mRate, setMRate] = useState(5.8);
  const [mYears, setMYears] = useState(30);

  const calculateMortgage = () => {
    const P = mHomePrice - mDownPayment;
    const r = mRate / 12 / 100;
    const N = mYears * 12;
    if (r === 0) return { principalInt: P / N, tax: 0, ins: 0, total: P / N };
    const pAndI = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    // Taxes (1.2% property tax annually)
    const tax = (mHomePrice * 0.012) / 12;
    // Insurance (0.5% home insurance annually)
    const ins = (mHomePrice * 0.005) / 12;
    return {
      principalInt: Math.round(pAndI),
      tax: Math.round(tax),
      ins: Math.round(ins),
      total: Math.round(pAndI + tax + ins)
    };
  };
  const mortgageVal = calculateMortgage();

  // WIDGET 4: SIP Calculator States
  const [sipMonthly, setSipMonthly] = useState(300);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  const calculateSIP = () => {
    const P = sipMonthly;
    const r = sipRate / 12 / 100;
    const n = sipYears * 12;
    if (r === 0) return { total: P * n, invested: P * n, wealth: 0 };
    const total = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    const invested = P * n;
    return { total: Math.round(total), invested: Math.round(invested), wealth: Math.round(total - invested) };
  };
  const sipVal = calculateSIP();

  // WIDGET 5: Investment Calculator States
  const [invLump, setInvLump] = useState(10000);
  const [invRate, setInvRate] = useState(8.0);
  const [invYears, setInvYears] = useState(10);

  const calculateInvestment = () => {
    const total = invLump * Math.pow(1 + invRate / 100, invYears);
    const profit = total - invLump;
    return { total: Math.round(total), invested: invLump, profit: Math.round(profit) };
  };
  const invVal = calculateInvestment();

  // WIDGET 6: Retirement Planner States
  const [retCurrentAge, setRetCurrentAge] = useState(30);
  const [retAge, setRetAge] = useState(60);
  const [retMonthlySavings, setRetMonthlySavings] = useState(500);
  const [retRate, setRetRate] = useState(8);

  const calculateRetirement = () => {
    const years = retAge - retCurrentAge;
    const P = retMonthlySavings;
    const r = retRate / 12 / 100;
    const n = years * 12;
    if (n <= 0) return { total: 0, monthlyP: 0 };
    const total = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    // 4% safe withdrawal monthly rate from nest-egg
    const monthlyPension = (total * 0.04) / 12;
    return { total: Math.round(total), monthlyPension: Math.round(monthlyPension) };
  };
  const retVal = calculateRetirement();

  // WIDGET 7: Compound Interest States
  const [compPrincipal, setCompPrincipal] = useState(5000);
  const [compRate, setCompRate] = useState(7);
  const [compFrequency, setCompFrequency] = useState(12); // monthly
  const [compYears, setCompYears] = useState(5);

  const calculateCompound = () => {
    const P = compPrincipal;
    const r = compRate / 100;
    const n = compFrequency;
    const t = compYears;
    const total = P * Math.pow(1 + r / n, n * t);
    return { total: Math.round(total), gain: Math.round(total - P) };
  };
  const compoundVal = calculateCompound();

  // WIDGET 8: Savings Calculator States
  const [saveTarget, setSaveTarget] = useState(20000);
  const [saveYears, setSaveYears] = useState(3);
  const [saveRate, setSaveRate] = useState(5);

  const calculateSavingsNeeded = () => {
    const T = saveTarget;
    const r = saveRate / 12 / 100;
    const N = saveYears * 12;
    if (r === 0) return T / N;
    const monthly = T * r / (Math.pow(1 + r, N) - 1);
    return Math.round(monthly);
  };
  const savingsNeededVal = calculateSavingsNeeded();

  // WIDGET 9: Tax Calculator States
  const [taxIncome, setTaxIncome] = useState(85000);
  const [taxDeductions, setTaxDeductions] = useState(14600); // Standard US 2024

  const calculateTax = () => {
    const taxable = Math.max(0, taxIncome - taxDeductions);
    let tax = 0;
    // Brackets: 10% on $11k, 12% to $44k, 22% to $95k, 24% above
    if (taxable <= 11000) {
      tax = taxable * 0.10;
    } else if (taxable <= 44725) {
      tax = (11000 * 0.10) + ((taxable - 11000) * 0.12);
    } else if (taxable <= 95375) {
      tax = (11000 * 0.10) + ((44725 - 11000) * 0.12) + ((taxable - 44725) * 0.22);
    } else {
      tax = (11000 * 0.10) + ((44725 - 11000) * 0.12) + ((95375 - 44725) * 0.22) + ((taxable - 95375) * 0.24);
    }
    const avgRate = taxIncome > 0 ? (tax / taxIncome) * 100 : 0;
    return { tax: Math.round(tax), avgRate: Math.round(avgRate * 10) / 10, taxable };
  };
  const taxVal = calculateTax();

  // WIDGET 10: Net Worth Calculator States
  const [nwCash, setNwCash] = useState(12000);
  const [nwProperties, setNwProperties] = useState(250000);
  const [nwStocks, setNwStocks] = useState(45000);
  const [nwDebtLoans, setNwDebtLoans] = useState(110000);
  const [nwDebtCards, setNwDebtCards] = useState(4000);

  const assetsTotal = nwCash + nwProperties + nwStocks;
  const liabilitiesTotal = nwDebtLoans + nwDebtCards;
  const netWorthVal = assetsTotal - liabilitiesTotal;

  // WIDGET 11: Emergency Fund States
  const [emExpense, setEmExpense] = useState(3200);
  const [emMultiplier, setEmMultiplier] = useState(6); // months

  const emTotalNeeded = emExpense * emMultiplier;

  // WIDGET 12: Currency Converter States
  const [currAmt, setCurrAmt] = useState(100);
  const [currBase, setCurrBase] = useState("USD");
  const [currTarget, setCurrTarget] = useState("EUR");

  const convertCurrency = () => {
    // Simulated live exchange rates from USD base
    const rates: { [key: string]: number } = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.78,
      INR: 83.4,
      CAD: 1.36,
      AUD: 1.49
    };
    // convert base to USD
    const amtInUsd = currAmt / rates[currBase];
    // convert USD to target
    const result = amtInUsd * rates[currTarget];
    return Math.round(result * 100) / 100;
  };
  const currencyResult = convertCurrency();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                Financial Tools Sandbox
              </h1>
              <p className="text-sm text-slate-500 mt-1">12 standalone widgets — select one and print your result instantly.</p>
            </div>
            <PrintButton label="Print Result" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Selector Menu Directory (12 cards) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[640px] overflow-y-auto pr-1">
              {toolList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTool(t.id)}
                  className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                    activeTool === t.id
                      ? "bg-white dark:bg-darkbg-850 border-brand-500 shadow-md scale-[1.02]"
                      : "bg-white/70 dark:bg-darkbg-800 border-slate-200/60 dark:border-slate-800 hover:bg-white"
                  }`}
                >
                  <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 flex-shrink-0">
                    {t.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white font-display">{t.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column: Dynamic Tool Workspace panel */}
            <div className="lg:col-span-7 bg-white dark:bg-darkbg-800 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md min-h-[500px] flex flex-col justify-between">
              
              <div>
                {/* EMI CALCULATOR */}
                {activeTool === "emi" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">EMI Repayment Calculator</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Loan Principal</span>
                          <span className="text-brand-655">${emiPrincipal.toLocaleString()}</span>
                        </div>
                        <input type="range" min="1000" max="100000" step="1000" value={emiPrincipal} onChange={(e) => setEmiPrincipal(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Annual APR %</span>
                          <span className="text-brand-655">{emiRate}%</span>
                        </div>
                        <input type="range" min="1" max="20" step="0.1" value={emiRate} onChange={(e) => setEmiRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Tenure (Months)</span>
                          <span className="text-brand-655">{emiTenure} Mos</span>
                        </div>
                        <input type="range" min="6" max="120" step="6" value={emiTenure} onChange={(e) => setEmiTenure(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-3 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly EMI</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${emiVal.emi}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total Interest</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${emiVal.totalInterest.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Grand Repayment</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${emiVal.totalPayment.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* LOAN CALCULATOR */}
                {activeTool === "loan" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Loan Repayment Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Loan Capital</span>
                          <span className="text-brand-655">${loanAmt.toLocaleString()}</span>
                        </div>
                        <input type="range" min="5000" max="250000" step="5000" value={loanAmt} onChange={(e) => setLoanAmt(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Interest APR</span>
                          <span className="text-brand-655">{loanRate}%</span>
                        </div>
                        <input type="range" min="1" max="15" step="0.1" value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Duration (Years)</span>
                          <span className="text-brand-655">{loanYears} Years</span>
                        </div>
                        <input type="range" min="1" max="15" step="1" value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-3 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly cost</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${loanVal.emi}/mo</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Interest costs</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${loanVal.totalInterest.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total repayment</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${loanVal.totalPayment.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* MORTGAGE CALCULATOR */}
                {activeTool === "mortgage" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Home Mortgage Estimator</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Property Price ($)</label>
                          <input type="number" value={mHomePrice} onChange={(e) => setMHomePrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Down Payment ($)</label>
                          <input type="number" value={mDownPayment} onChange={(e) => setMDownPayment(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Interest APR %</label>
                          <input type="number" step="0.1" value={mRate} onChange={(e) => setMRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Loan Tenure (Years)</label>
                          <input type="number" value={mYears} onChange={(e) => setMYears(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-4 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Principal + Int</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">${mortgageVal.principalInt}/mo</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Property Tax</p>
                        <p className="text-sm font-bold text-slate-850 dark:text-slate-300 mt-1">${mortgageVal.tax}/mo</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Insurance</p>
                        <p className="text-sm font-bold text-slate-850 dark:text-slate-300 mt-1">${mortgageVal.ins}/mo</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-brand-655 font-bold uppercase">Grand Total</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${mortgageVal.total}/mo</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SIP CALCULATOR */}
                {activeTool === "sip" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">SIP (Systematic Investment) Calculator</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Monthly SIP Contribution</span>
                          <span className="text-brand-655">${sipMonthly} / Mo</span>
                        </div>
                        <input type="range" min="20" max="2000" step="20" value={sipMonthly} onChange={(e) => setSipMonthly(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Expected Return %</span>
                          <span className="text-brand-655">{sipRate}%</span>
                        </div>
                        <input type="range" min="3" max="18" step="0.5" value={sipRate} onChange={(e) => setSipRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Investment Duration</span>
                          <span className="text-brand-655">{sipYears} Years</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-3 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Invested Principal</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${sipVal.invested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Wealth Earned</p>
                        <p className="text-base font-bold text-emerald-500 mt-1">${sipVal.wealth.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Future Value</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${sipVal.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* LUMPSUM CALCULATOR */}
                {activeTool === "investment" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Lumpsum Growth Planner</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Initial Principal</span>
                          <span className="text-brand-655">${invLump.toLocaleString()}</span>
                        </div>
                        <input type="range" min="1000" max="100000" step="1000" value={invLump} onChange={(e) => setInvLump(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Interest rate %</span>
                          <span className="text-brand-655">{invRate}%</span>
                        </div>
                        <input type="range" min="2" max="15" step="0.5" value={invRate} onChange={(e) => setInvRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Duration (Years)</span>
                          <span className="text-brand-655">{invYears} Years</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value={invYears} onChange={(e) => setInvYears(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-3 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Invested capital</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${invVal.invested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Wealth gain</p>
                        <p className="text-base font-bold text-emerald-500 mt-1">${invVal.profit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Target Value</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${invVal.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* RETIREMENT PLANNER */}
                {activeTool === "retirement" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Retirement Nest-Egg Planner</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Current Age</label>
                          <input type="number" value={retCurrentAge} onChange={(e) => setRetCurrentAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Target Retirement Age</label>
                          <input type="number" value={retAge} onChange={(e) => setRetAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Monthly Contribution ($)</label>
                          <input type="number" value={retMonthlySavings} onChange={(e) => setRetMonthlySavings(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Expected Annual APR %</label>
                          <input type="number" step="0.5" value={retRate} onChange={(e) => setRetRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-2 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Retirement Fund Nest-Egg</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${retVal.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Monthly Pension (4% Rule)</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${retVal.monthlyPension}/mo</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* COMPOUND INTEREST */}
                {activeTool === "compound" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Compound Interest Growth Calculator</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Principal Capital ($)</label>
                          <input type="number" value={compPrincipal} onChange={(e) => setCompPrincipal(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Compounding Frequency</label>
                          <select value={compFrequency} onChange={(e) => setCompFrequency(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs">
                            <option value="1">Annually</option>
                            <option value="4">Quarterly</option>
                            <option value="12">Monthly</option>
                            <option value="365">Daily</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Annual APR %</label>
                          <input type="number" step="0.5" value={compRate} onChange={(e) => setCompRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Duration (Years)</label>
                          <input type="number" value={compYears} onChange={(e) => setCompYears(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-2 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Compound Wealth Gained</p>
                        <p className="text-base font-bold text-emerald-500 mt-1">${compoundVal.gain.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total Future Value</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${compoundVal.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SAVINGS GOAL SOLVER */}
                {activeTool === "savings" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Savings Target Calculator</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Target Savings Amount</span>
                          <span className="text-brand-655">${saveTarget.toLocaleString()}</span>
                        </div>
                        <input type="range" min="1000" max="100000" step="1000" value={saveTarget} onChange={(e) => setSaveTarget(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Expected Return (Savings Account)</span>
                          <span className="text-brand-655">{saveRate}%</span>
                        </div>
                        <input type="range" min="1" max="8" step="0.25" value={saveRate} onChange={(e) => setSaveRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Time Limit (Years)</span>
                          <span className="text-brand-655">{saveYears} Years</span>
                        </div>
                        <input type="range" min="1" max="10" step="1" value={saveYears} onChange={(e) => setSaveYears(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl text-center mt-6">
                      <p className="text-xs text-slate-400 font-bold uppercase">Required Monthly Contribution Needed</p>
                      <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">${savingsNeededVal.toLocaleString()} / mo</p>
                      <p className="text-[10px] text-slate-400 mt-1">To achieve your ${saveTarget.toLocaleString()} goal in {saveYears} years earning {saveRate}% interest.</p>
                    </div>
                  </div>
                )}

                {/* TAX BRACKET CALCULATOR */}
                {activeTool === "tax" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Income Tax Slab Estimator</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Gross Annual Income ($)</label>
                          <input type="number" value={taxIncome} onChange={(e) => setTaxIncome(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs font-semibold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Standard / Itemized Deductions ($)</label>
                          <input type="number" value={taxDeductions} onChange={(e) => setTaxDeductions(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-3 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Taxable Income</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">${taxVal.taxable.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Tax</p>
                        <p className="text-base font-extrabold text-rose-500 mt-1">${taxVal.tax.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Effective Tax Rate</p>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">{taxVal.avgRate}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* NET WORTH CALCULATOR */}
                {activeTool === "networth" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Assets vs Liabilities Net Worth Tracker</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Assets */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase tracking-widest text-brand-655 font-bold">Assets</h4>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500">Cash / Savings ($)</label>
                            <input type="number" value={nwCash} onChange={(e) => setNwCash(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-55 border text-xs" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500">Property / Vehicles ($)</label>
                            <input type="number" value={nwProperties} onChange={(e) => setNwProperties(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-55 border text-xs" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500">Stocks / Portfolios ($)</label>
                            <input type="number" value={nwStocks} onChange={(e) => setNwStocks(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-55 border text-xs" />
                          </div>
                        </div>

                        {/* Liabilities */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase tracking-widest text-rose-500 font-bold">Liabilities</h4>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500">Mortgage & Loans ($)</label>
                            <input type="number" value={nwDebtLoans} onChange={(e) => setNwDebtLoans(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-55 border text-xs" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500">Credit Card Debt ($)</label>
                            <input type="number" value={nwDebtCards} onChange={(e) => setNwDebtCards(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-55 border text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl grid grid-cols-3 gap-4 text-center mt-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total Assets</p>
                        <p className="text-base font-bold text-emerald-600 mt-1">${assetsTotal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total Liabilities</p>
                        <p className="text-base font-bold text-rose-500 mt-1">${liabilitiesTotal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Calculated Net Worth</p>
                        <p className="text-base font-extrabold text-brand-600 dark:text-brand-400 mt-1">${netWorthVal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* EMERGENCY FUND CALCULATOR */}
                {activeTool === "emergency" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Emergency Fund Planner</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Average Monthly Expenses</span>
                          <span className="text-brand-655">${emExpense.toLocaleString()} / Month</span>
                        </div>
                        <input type="range" min="1000" max="10000" step="200" value={emExpense} onChange={(e) => setEmExpense(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Safety Multiplier (Months)</span>
                          <span className="text-brand-655">{emMultiplier} Months</span>
                        </div>
                        <input type="range" min="3" max="12" step="1" value={emMultiplier} onChange={(e) => setEmMultiplier(Number(e.target.value))} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl text-center mt-6">
                      <p className="text-xs text-slate-400 font-bold uppercase">Target Emergency Cash Required</p>
                      <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">${emTotalNeeded.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">This will cushion your household for {emMultiplier} months should you encounter unexpected loss of income.</p>
                    </div>
                  </div>
                )}

                {/* CURRENCY CONVERTER */}
                {activeTool === "currency" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display pb-3 border-b">Global Currency Converter</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Amount to Convert</label>
                        <input type="number" value={currAmt} onChange={(e) => setCurrAmt(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-55 border text-xs font-semibold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Base Currency</label>
                          <select value={currBase} onChange={(e) => setCurrBase(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-55 border text-xs">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="CAD">CAD (C$)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">Target Currency</label>
                          <select value={currTarget} onChange={(e) => setCurrTarget(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-55 border text-xs">
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="AUD">AUD (A$)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border rounded-2xl text-center mt-6">
                      <p className="text-xs text-slate-400 font-bold uppercase">Simulated Conversion Value</p>
                      <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">{currencyResult.toLocaleString()} {currTarget}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Simulated relative exchange rate values.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure statement tagline */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-500" />
                <span>Calculations executed entirely client-side. No data logs recorded.</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
