"use client";

import React, { useState } from "react";
import { DEFAULT_DEBTS, generateSmartRecommendation, formatCurrency } from "@/lib/debt-utils";
import { RecommenderAnswers, RecommendationOutput } from "@/lib/types";
import { useLanguage } from "./providers/language-provider";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Zap,
  RotateCcw
} from "lucide-react";
import { FadeInStagger, FadeInItem } from "./slide-wrapper";

export function SmartDebtRecommender() {
  const { t } = useLanguage();

  const [answers, setAnswers] = useState<RecommenderAnswers>({
    primaryGoal: "motivation",
    extraBudget: 300,
    stressLevel: "medium",
    creditScore: "good",
  });

  const [result, setResult] = useState<RecommendationOutput | null>(null);

  const handleCalculate = () => {
    const res = generateSmartRecommendation(DEFAULT_DEBTS, answers.extraBudget, answers);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-blue-900/10 via-slate-900/5 to-emerald-900/10 dark:from-blue-950/40 dark:to-slate-900/60 border-blue-500/20">
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>{t("recommender_title")}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t("recommender_subtitle")}
        </h2>
      </div>

      {/* Interactive Wizard Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>Customize Your Financial Profile</span>
          </h3>

          {/* Q1: Primary Goal */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              1. {t("q1")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: "motivation", labelKey: "q1_a1" },
                { id: "save_money", labelKey: "q1_a2" },
                { id: "balance", labelKey: "q1_a3" },
                { id: "simplify", labelKey: "q1_a4" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, primaryGoal: opt.id as any })}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    answers.primaryGoal === opt.id
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Extra Monthly Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. {t("q2")}
              </label>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(answers.extraBudget)}/mo
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={answers.extraBudget}
              onChange={(e) => setAnswers({ ...answers, extraBudget: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Q3: Financial Stress Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              3. {t("q3")}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "low", labelKey: "q3_low" },
                { id: "medium", labelKey: "q3_med" },
                { id: "high", labelKey: "q3_high" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, stressLevel: opt.id as any })}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    answers.stressLevel === opt.id
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Q4: Credit Score */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              4. {t("q4")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "poor", labelKey: "q4_poor" },
                { id: "fair", labelKey: "q4_fair" },
                { id: "good", labelKey: "q4_good" },
                { id: "excellent", labelKey: "q4_excellent" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, creditScore: opt.id as any })}
                  className={`p-3 rounded-xl text-xs font-semibold text-center transition-all border ${
                    answers.creditScore === opt.id
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{t("get_recommendation")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Output Recommendation Result Card */}
        <div>
          {result ? (
            <div className="glass-panel p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  {t("recommended_badge")}
                </span>
                <button 
                  onClick={() => setResult(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Recalculate
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {t(result.titleKey)}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(result.reasonKey)}
                </p>
              </div>

              {result.savingsDiff > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-400 font-bold block">{t("interest_saved_avalanche")}</span>
                    <span className="text-2xl font-black text-amber-300">{formatCurrency(result.savingsDiff)}</span>
                  </div>
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
              )}

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recommended Action Steps:
                </h4>
                <FadeInStagger className="space-y-2.5">
                  {result.actionableSteps.map((step, idx) => (
                    <FadeInItem key={idx}>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-slate-200 font-medium leading-normal">
                          {step}
                        </p>
                      </div>
                    </FadeInItem>
                  ))}
                </FadeInStagger>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400 border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Ready for personalized advice?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                  Adjust the questions on the left and click "Calculate Best Strategy" to generate your custom payoff blueprint.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
