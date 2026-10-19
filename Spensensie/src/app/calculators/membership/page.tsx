"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { 
  Calculator, Printer, Share2, Save, Sparkles, Check, 
  Trash2, HelpCircle, FileText, ArrowRight, RefreshCw, Award
} from "lucide-react";
import { motion } from "framer-motion";

function MembershipCalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { saveCalculation, savedCalculations, deleteCalculation, user } = useAppState();

  // Inputs
  const [title, setTitle] = useState("My Gym Membership");
  const [fee, setFee] = useState(60);
  const [joiningFee, setJoiningFee] = useState(25);
  const [processingFee, setProcessingFee] = useState(5);
  const [taxPercent, setTaxPercent] = useState(10);
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountVal, setDiscountVal] = useState(10);
  const [duration, setDuration] = useState<"MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY">("MONTHLY");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState("");
  const [promoError, setPromoError] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState(0);

  // Sharing & Saving feedback
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Read URL query parameters on mount to prefill state
  useEffect(() => {
    const qTitle = searchParams.get("title");
    const qFee = searchParams.get("fee");
    const qJoin = searchParams.get("join");
    const qProc = searchParams.get("proc");
    const qTax = searchParams.get("tax");
    const qDiscT = searchParams.get("discT");
    const qDiscV = searchParams.get("discV");
    const qDur = searchParams.get("dur");
    const qAdd = searchParams.get("add");

    if (qTitle) setTitle(qTitle);
    if (qFee) setFee(Number(qFee));
    if (qJoin) setJoiningFee(Number(qJoin));
    if (qProc) setProcessingFee(Number(qProc));
    if (qTax) setTaxPercent(Number(qTax));
    if (qDiscT) setDiscountType(qDiscT === "FIXED" ? "FIXED" : "PERCENT");
    if (qDiscV) setDiscountVal(Number(qDiscV));
    if (qDur) setDuration(qDur as any);
    if (qAdd) setAdditionalCharges(Number(qAdd));
  }, [searchParams]);

  // Calculations
  const calculateTotals = () => {
    // 1. Calculate Base subtotal depending on duration
    let multiplier = 1;
    let months = 1;
    if (duration === "QUARTERLY") {
      multiplier = 3;
      months = 3;
    } else if (duration === "HALF_YEARLY") {
      multiplier = 6;
      months = 6;
    } else if (duration === "YEARLY") {
      multiplier = 12;
      months = 12;
    }

    const baseCost = fee * multiplier;
    
    // 2. Apply general discount
    let discountAmt = 0;
    if (discountType === "PERCENT") {
      discountAmt = (baseCost * discountVal) / 100;
    } else {
      discountAmt = Math.min(baseCost, discountVal);
    }

    // 3. Apply promo code discount (simulated)
    let promoDiscountAmt = 0;
    if (promoApplied === "SAVE10") {
      promoDiscountAmt = (baseCost - discountAmt) * 0.10;
    } else if (promoApplied === "WELCOME50") {
      promoDiscountAmt = Math.min(baseCost - discountAmt, 50);
    } else if (promoApplied === "FREEJOIN") {
      // Handled by overriding joining fee
    }

    const netBaseCost = Math.max(0, baseCost - discountAmt - promoDiscountAmt);
    
    // Adjust joining fee for FREEJOIN
    const actualJoiningFee = promoApplied === "FREEJOIN" ? 0 : joiningFee;
    
    const preTaxTotal = netBaseCost + actualJoiningFee + processingFee + additionalCharges;
    const taxAmt = (preTaxTotal * taxPercent) / 100;
    const grandTotal = preTaxTotal + taxAmt;

    // Amortized Rates
    const monthlyRate = grandTotal / months;
    const weeklyRate = grandTotal / (months * 4.33);
    const dailyRate = grandTotal / (months * 30.4);

    return {
      baseCost,
      discountAmt: discountAmt + promoDiscountAmt,
      actualJoiningFee,
      taxAmt,
      grandTotal: Math.round(grandTotal * 100) / 100,
      monthlyRate: Math.round(monthlyRate * 100) / 100,
      weeklyRate: Math.round(weeklyRate * 100) / 100,
      dailyRate: Math.round(dailyRate * 100) / 100
    };
  };

  const results = calculateTotals();

  // Apply promo codes
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    if (code === "SAVE10" || code === "WELCOME50" || code === "FREEJOIN") {
      setPromoApplied(code);
      setPromoCode("");
    } else {
      setPromoError("Invalid promo code. Try SAVE10, WELCOME50, or FREEJOIN.");
    }
  };

  // Save calculation
  const handleSave = () => {
    saveCalculation({
      type: "MEMBERSHIP",
      title: title || "Membership Calculation",
      details: {
        fee, joiningFee, processingFee, taxPercent, discountType,
        discountVal, duration, promoApplied, additionalCharges,
        results
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Share calculation (URL copy)
  const handleShare = () => {
    const params = new URLSearchParams({
      title,
      fee: fee.toString(),
      join: joiningFee.toString(),
      proc: processingFee.toString(),
      tax: taxPercent.toString(),
      discT: discountType,
      discV: discountVal.toString(),
      dur: duration,
      add: additionalCharges.toString()
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Quick reload/reset parameters
  const handleReset = () => {
    setTitle("My Gym Membership");
    setFee(60);
    setJoiningFee(25);
    setProcessingFee(5);
    setTaxPercent(10);
    setDiscountType("PERCENT");
    setDiscountVal(10);
    setDuration("MONTHLY");
    setPromoCode("");
    setPromoApplied("");
    setPromoError("");
    setAdditionalCharges(0);
    router.replace(window.location.pathname);
  };

  // Pre-load saved calculations
  const mySaves = savedCalculations.filter((c) => c.type === "MEMBERSHIP");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto print-container">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 no-print">
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-655 font-bold flex items-center space-x-1.5 mb-2">
                <Award className="w-4 h-4 text-emerald-500 animate-pulse-slow" />
                <span>Advanced Amortization Tools</span>
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center space-x-2">
                <Calculator className="w-8 h-8 text-brand-500" />
                <span>Membership Cost Calculator</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Break down annual, quarterly, or monthly subscription fees into true daily rates.</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={handleReset}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                title="Reset Inputs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-sm font-semibold flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Panel */}
            <div className="lg:col-span-7 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md no-print">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                Calculator Parameters
              </h3>

              <div className="space-y-6">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Membership Label / Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Gold's Gym, Adobe Creative Cloud"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 text-sm font-medium"
                  />
                </div>

                {/* Base Fee Sliders */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Recurring Base Fee</span>
                    <span className="text-brand-600 dark:text-brand-400">${fee} / Month</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Billing Interval</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="HALF_YEARLY">Half-Yearly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  {/* Joining Fee */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Joining Fee ($)</label>
                    <input
                      type="number"
                      value={joiningFee}
                      onChange={(e) => setJoiningFee(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                    />
                  </div>

                  {/* Processing Fee */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Processing Fee ($)</label>
                    <input
                      type="number"
                      value={processingFee}
                      onChange={(e) => setProcessingFee(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Discounts Slider */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Standard Discount</span>
                    <div className="flex bg-white dark:bg-darkbg-800 border border-slate-250 dark:border-slate-700 rounded-lg p-0.5 text-xs">
                      <button
                        onClick={() => { setDiscountType("PERCENT"); setDiscountVal(10); }}
                        className={`px-2.5 py-1 rounded-md transition-colors ${discountType === "PERCENT" ? "bg-brand-500 text-white font-bold" : "text-slate-500"}`}
                      >
                        % Percent
                      </button>
                      <button
                        onClick={() => { setDiscountType("FIXED"); setDiscountVal(15); }}
                        className={`px-2.5 py-1 rounded-md transition-colors ${discountType === "FIXED" ? "bg-brand-500 text-white font-bold" : "text-slate-500"}`}
                      >
                        $ Flat
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Value</span>
                      <span>{discountType === "PERCENT" ? `${discountVal}%` : `$${discountVal}`}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={discountType === "PERCENT" ? 100 : 300}
                      step="5"
                      value={discountVal}
                      onChange={(e) => setDiscountVal(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Additional Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Additional Charges */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Additional Charges / Addons ($)</label>
                    <input
                      type="number"
                      value={additionalCharges}
                      onChange={(e) => setAdditionalCharges(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                    />
                  </div>

                  {/* Tax */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Tax / GST (%)</label>
                    <input
                      type="number"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Promo Code Entry */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try 'SAVE10', 'WELCOME50', or 'FREEJOIN'"
                      className="flex-grow px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {promoApplied && (
                    <div className="mt-2 text-xs text-brand-600 dark:text-brand-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Promo code <span className="font-bold">{promoApplied}</span> applied successfully!</span>
                      <button onClick={() => setPromoApplied("")} className="text-rose-500 hover:underline ml-2">Remove</button>
                    </div>
                  )}
                  {promoError && <p className="mt-2 text-xs text-rose-500">{promoError}</p>}
                </div>
              </div>
            </div>

            {/* Results Live Breakdown Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Invoice Breakdown */}
              <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="border-b border-slate-200/50 dark:border-slate-800/80 pb-4 mb-4">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Calculation Result</span>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white truncate mt-1">{title || "Membership cost"}</h2>
                  <p className="text-xs text-slate-500 mt-1 capitalize leading-none font-medium">Billed Interval: {duration.toLowerCase().replace("_", " ")}</p>
                </div>

                <div className="space-y-3.5 text-sm font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Cost ({duration})</span>
                    <span className="text-slate-900 dark:text-white">${results.baseCost}</span>
                  </div>

                  {results.discountAmt > 0 && (
                    <div className="flex justify-between text-brand-600 dark:text-brand-400">
                      <span>Total Savings / Discounts</span>
                      <span>-${results.discountAmt}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-500">Joining Fee</span>
                    <span className="text-slate-900 dark:text-white">${results.actualJoiningFee}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Processing charges</span>
                    <span className="text-slate-900 dark:text-white">${processingFee}</span>
                  </div>

                  {additionalCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Addons / Extra cost</span>
                      <span className="text-slate-900 dark:text-white">${additionalCharges}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxes ({taxPercent}%)</span>
                    <span className="text-slate-900 dark:text-white">${results.taxAmt.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 flex justify-between items-baseline">
                    <span className="text-slate-950 dark:text-white text-base">Grand Total Cost</span>
                    <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 font-display">${results.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Amortized true costs breakdown */}
                <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/80 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-3">True Amortized Rates</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">${results.monthlyRate}/mo</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weekly</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">${results.weeklyRate}/wk</p>
                    </div>
                    <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-brand-500/20 p-2.5 rounded-xl text-center">
                      <p className="text-[10px] text-brand-655 font-bold uppercase tracking-wider">Daily Rate</p>
                      <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-1">${results.dailyRate}/day</p>
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="mt-8 grid grid-cols-2 gap-3 no-print">
                  <button
                    onClick={handleShare}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-850 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-brand-500" />
                        <span>Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-slate-400" />
                        <span>Share Config</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSave}
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-brand-500/15"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved to History</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Calculation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Saved History List */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm no-print">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display mb-4 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>My Saved Calculations ({mySaves.length})</span>
                </h3>

                {mySaves.length === 0 ? (
                  <p className="text-xs text-slate-400 leading-normal italic py-3 text-center">No calculations saved yet. Adjust sliders and click Save above.</p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {mySaves.map((calc) => (
                      <div 
                        key={calc.id} 
                        className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="max-w-[70%]">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{calc.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Grand Total: <span className="font-bold text-brand-600">${calc.details.results.grandTotal}</span> (${calc.details.results.dailyRate}/day)</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              // Reload configuration into form
                              setTitle(calc.title);
                              setFee(calc.details.fee);
                              setJoiningFee(calc.details.joiningFee);
                              setProcessingFee(calc.details.processingFee);
                              setTaxPercent(calc.details.taxPercent);
                              setDiscountType(calc.details.discountType);
                              setDiscountVal(calc.details.discountVal);
                              setDuration(calc.details.duration);
                              setPromoApplied(calc.details.promoApplied || "");
                              setAdditionalCharges(calc.details.additionalCharges || 0);
                            }}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-brand-600 font-bold"
                            title="Load config"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteCalculation(calc.id)}
                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-lg text-rose-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Printable Layout Details (Hidden in screen, shows only on print) */}
          <div className="hidden print:block w-full text-slate-900 p-8 space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <h1 className="text-3xl font-extrabold font-display">SpendSensie Finance Report</h1>
              <p className="text-sm mt-1">Amortized Subscription & Membership Audit Statement</p>
              <p className="text-xs text-slate-400 mt-2">Generated on: {new Date().toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-500 uppercase">Configuration details</h3>
                <table className="w-full mt-2 text-xs border-collapse">
                  <tbody>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Label:</td>
                      <td>{title}</td>
                    </tr>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Base Cost:</td>
                      <td>${fee} / Month ({duration.toLowerCase()})</td>
                    </tr>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Interval:</td>
                      <td className="capitalize">{duration.toLowerCase().replace("_", " ")}</td>
                    </tr>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Discounts / Promo:</td>
                      <td>{discountType === "PERCENT" ? `${discountVal}%` : `$${discountVal}`} {promoApplied ? `(${promoApplied})` : ""}</td>
                    </tr>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Joining Fee:</td>
                      <td>${results.actualJoiningFee}</td>
                    </tr>
                    <tr className="border-b py-1">
                      <td className="font-semibold pr-2">Processing + Addons:</td>
                      <td>${processingFee + additionalCharges}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-500 uppercase">Amortized Rate Breakdown</h3>
                <div className="mt-2 border-2 border-brand-500 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between border-b pb-1 text-sm">
                    <span className="font-semibold">Grand Total Billed Cost:</span>
                    <span className="font-bold">${results.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span>Monthly Amortized Cost:</span>
                    <span className="font-semibold">${results.monthlyRate}/mo</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span>Weekly Amortized Cost:</span>
                    <span className="font-semibold">${results.weeklyRate}/wk</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-600 font-bold">
                    <span>True Daily Cost:</span>
                    <span>${results.dailyRate}/day</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 text-center text-[10px] text-slate-400">
              SpendSensie Secure FinTech Analytics - Prepared for {user?.name || "Member"}.
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MembershipCalculator() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-400 font-semibold animate-pulse">Loading Membership Calculator...</p></div>}>
      <MembershipCalculatorContent />
    </Suspense>
  );
}
