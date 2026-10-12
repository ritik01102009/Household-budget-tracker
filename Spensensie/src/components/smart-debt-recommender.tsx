"use client";

import React, { useState } from "react";
import { BarChart3, CheckCircle2, RotateCcw, ArrowRight, FileText, Printer } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface QuestionOption {
  label: string;
  value: string;
}

interface QuestionItem {
  id: string;
  question: string;
  options: QuestionOption[];
}

interface SmartDebtRecommenderProps {
  onNavigate?: (tab: string) => void;
}

export function SmartDebtRecommender({ onNavigate }: SmartDebtRecommenderProps) {
  const { t, language } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const questions: QuestionItem[] =
    language === "ja"
      ? [
          {
            id: "motivation",
            question: "あなたのモチベーションが最も高まるのはどんな時ですか？",
            options: [
              { label: "小さくても完済した借入が1つ消える達成感をすぐ味わいたい", value: "snowball" },
              { label: "利息を1円でも多く削って、トータルの出費を最小限に抑えたい", value: "avalanche" },
            ],
          },
          {
            id: "debts",
            question: "現在抱えている借入・ローンの件数はいくつですか？",
            options: [
              { label: "2〜3件程度（管理しやすい件数）", value: "either" },
              { label: "4件以上（件数が多く複雑）", value: "avalanche" },
            ],
          },
          {
            id: "rates",
            question: "年利15%〜20%以上の高金利ローン（リボ払いや消費者金融）はありますか？",
            options: [
              { label: "はい — 高金利のリボ払い・カードローンがある", value: "avalanche" },
              { label: "いいえ — 住宅やマイカーなど低金利のものが中心", value: "snowball" },
            ],
          },
          {
            id: "discipline",
            question: "お金の管理に対するあなたの性格はどちらに近いですか？",
            options: [
              { label: "感情面やモチベーションの維持が何より大切", value: "snowball" },
              { label: "数字や損得勘定を徹底して論理的に進めるのが得意", value: "avalanche" },
            ],
          },
        ]
      : [
          {
            id: "motivation",
            question: "What motivates you most when paying off debt?",
            options: [
              { label: "Quick wins — I need to see debts disappear fast to stay encouraged", value: "snowball" },
              { label: "Saving the maximum money on interest over time", value: "avalanche" },
            ],
          },
          {
            id: "debts",
            question: "How many individual debts do you currently have?",
            options: [
              { label: "2–3 debts (manageable quantity)", value: "either" },
              { label: "4+ debts (multiple complex balances)", value: "avalanche" },
            ],
          },
          {
            id: "rates",
            question: "Do you have high-interest debts (15%+ APR credit cards)?",
            options: [
              { label: "Yes — credit cards with high APR accruing fast", value: "avalanche" },
              { label: "No — mostly lower-interest loans", value: "snowball" },
            ],
          },
          {
            id: "discipline",
            question: "How do you handle long-term financial discipline?",
            options: [
              { label: "I need psychological milestones to maintain consistency", value: "snowball" },
              { label: "I stick strictly to the mathematical optimization", value: "avalanche" },
            ],
          },
        ];

  const recommendationsData =
    language === "ja"
      ? {
          snowball: {
            method: "スノーボール方式（雪だるま式）",
            color: "from-sky-500 to-blue-500",
            reason:
              "あなたには「小さな成功体験」が最も効果的です。残高の一番小さい借入から優先して完済し、支払っていた返済原資を次の借入に次々上乗せしていくことで、劇的な勢いをつけることができます。",
            tips: [
              "残高の少ない順にすべての借入を並べ替えます",
              "最小の借入以外はすべて「最低支払額」に設定します",
              "余剰資金の全額を、一番残高の小さい借入に集中砲火します",
              "1件完済したら、その返済額を次の借入にそのままスライド加算します",
            ],
          },
          avalanche: {
            method: "アバランチ方式（雪崩式・高金利優先）",
            color: "from-violet-500 to-purple-500",
            reason:
              "数学的に最も無駄がない最適解です。金利（年利）が最も高い借入から集中して撃破することで、金融機関に支払う利息の総額を最小限に抑え、最速で純資産を回復させます。",
            tips: [
              "金利（年利%）の高い順にすべての借入を並べ替えます",
              "最高金利の借入以外は最低返済額にとどめます",
              "追加返済額の全額を最高金利の借入に投入します",
              "完済したら、次に金利が高い借入へ繰り上げます",
            ],
          },
          either: {
            method: "ハイブリッド（どちらの方式も効果抜群！）",
            color: "from-emerald-500 to-teal-500",
            reason:
              "あなたの借入状況は柔軟です。モチベーションを重視するならスノーボール法、利息削減を極めたいならアバランチ法のどちらを選んでも素晴らしい成果が得られます。",
            tips: [
              "直感的に取り組みやすい方を選択してください",
              "返済戦略よりも「毎月継続して追加返済すること」が一番の鍵です",
              "1件完済するごとに自分へのご褒美を用意して継続力を高めましょう",
            ],
          },
        }
      : {
          snowball: {
            method: "Debt Snowball Method",
            color: "from-sky-500 to-blue-500",
            reason:
              "You benefit most from fast psychological wins. Eliminating smaller balances first produces rapid momentum, giving you the boost needed to conquer the bigger debts.",
            tips: [
              "List debts strictly from smallest to largest balance",
              "Pay minimums on everything except the smallest balance",
              "Attack the smallest debt with every extra dollar",
              "Roll the entire payment into the next smallest once eliminated",
            ],
          },
          avalanche: {
            method: "Debt Avalanche Method",
            color: "from-violet-500 to-purple-500",
            reason:
              "You are mathematically oriented and want to pay the absolute least in interest. Targeting the highest APR debt first saves the most money and eliminates dangerous interest.",
            tips: [
              "List debts strictly from highest to lowest interest rate (APR)",
              "Pay minimums on all debts except the highest interest rate",
              "Funnel all extra payments toward the highest APR debt",
              "Move to the next highest rate immediately after each payoff",
            ],
          },
          either: {
            method: "Either Method Works Great!",
            color: "from-emerald-500 to-teal-500",
            reason:
              "Your balance profile is balanced. Both methods will yield very similar results. Choose whichever approach inspires you to take consistent action.",
            tips: [
              "Pick the one that feels naturally easier to start today",
              "Consistency matters significantly more than method perfection",
              "Celebrate each debt you cross off your list",
            ],
          },
        };

  const answer = (value: string) => {
    const newAnswers = { ...answers, [questions[current].id]: value };
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const recommendKey = (): "snowball" | "avalanche" | "either" => {
    const vals = Object.values(answers);
    const snowballs = vals.filter((v) => v === "snowball").length;
    const avalanches = vals.filter((v) => v === "avalanche").length;
    if (snowballs > avalanches) return "snowball";
    if (avalanches > snowballs) return "avalanche";
    return "either";
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrent(0);
    setDone(false);
  };

  const currentQ = questions[current];
  const recKey = recommendKey();
  const rec = recommendationsData[recKey];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("recommender.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("recommender.subtitle")}</p>
        </div>
      </div>

      {!done ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                {t("recommender.step")} {current + 1} {t("recommender.of")} {questions.length}
              </span>
              <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => answer(opt.value)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:border-violet-300 dark:hover:border-violet-600 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-all shadow-xs flex items-center justify-between group cursor-pointer"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            {t("recommender.recommended_result")}
          </div>

          <div className={`p-6 rounded-2xl bg-gradient-to-br ${rec.color} text-white shadow-lg`}>
            <h3 className="text-2xl font-black mb-2">{rec.method}</h3>
            <p className="text-white/90 text-sm leading-relaxed">{rec.reason}</p>
          </div>

          {/* Actionable Tips */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {language === "ja" ? "今すぐ始める実践ステップ" : "Actionable Action Plan"}
            </h4>
            <div className="space-y-2">
              {rec.tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Continue to Calculator + PDF Export + Print Report + Retake */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* PDF Export Button */}
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title={language === "ja" ? "PDFで保存" : "Export to PDF"}
              >
                <FileText className="w-3.5 h-3.5 text-violet-500" />
                <span>{language === "ja" ? "PDF出力" : "Export PDF"}</span>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title={language === "ja" ? "印刷する" : "Print Report"}
              >
                <Printer className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === "ja" ? "印刷" : "Print"}</span>
              </button>

              {/* Retake Quiz */}
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("recommender.retake")}</span>
              </button>
            </div>

            {/* Continue Button to Debt Calculator */}
            <button
              onClick={() => onNavigate ? onNavigate("debt") : null}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span>{language === "ja" ? "返済シミュレーターで計算する" : "Continue to Debt Planner"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
