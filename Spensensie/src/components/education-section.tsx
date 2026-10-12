"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function EducationSection() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState<string | null>("snowball");

  const articles =
    language === "ja"
      ? [
          {
            id: "snowball",
            title: "デット・スノーボール方式（雪だるま式返済術）",
            category: "返済戦略",
            categoryColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
            summary: "残高の一番小さい借入から順に完済し、心理的な達成感と勢いを生み出す手法です。",
            content: [
              "「デット・スノーボール法」は、全米屈指のファイナンシャルエキスパートであるデイブ・ラムジー氏が提唱した、行動心理学に基づく強力な返済戦略です。",
              "【具体的な手順】すべての借入を金利に関係なく「残高の小さい順」に一覧化します。一番小さい借入以外のすべてのローンは最低支払額のみを支払い、手元の余剰資金をすべて一番小さい借入に集中して完済させます。",
              "【雪だるま効果】1件完済したら、その借入に支払っていた金額をそのまま次の小さい借入の返済に上乗せします。転がる雪だるまのように返済パワーが加速していきます。",
              "【メリット】短期間で「1件完済できた！」という強烈な成功体験が得られ、挫折せずに完済まで走り抜けるモチベーションを保てます。",
              "【こんな人におすすめ】数字の計算よりも、達成感やモチベーションを維持して着実に完済したい方。",
            ],
          },
          {
            id: "avalanche",
            title: "デット・アバランチ方式（雪崩式・高金利優先返済術）",
            category: "返済戦略",
            categoryColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
            summary: "金利（年利%）が最も高い借入から集中撃破し、支払う利息総額を数学的に最小化する手法です。",
            content: [
              "「デット・アバランチ法」は、数学的・経済学的に最も合理的で、支払う総費用を最も抑えられる純資産最大化アプローチです。",
              "【具体的な手順】すべての借入を「金利（APR%）が高い順」に並べ替えます。最高金利の借入以外は最低返済額に抑え、追加返済可能な資金の全額を最高金利の借入に注ぎ込みます。",
              "【雪崩効果】高金利ローンが消えると毎月発生する高額な利息負担が劇的に軽くなり、浮いた利息分がそのまま次の返済スピードを加速させます。",
              "【メリット】金融機関に支払う利息の合計額を劇的に削減でき、完済までのトータル出費を最小限に抑えられます。",
              "【こんな人におすすめ】年利15%以上のリボ払いや高金利カードローンをお持ちの方、数学的合理性を好む方。",
            ],
          },
          {
            id: "budgeting",
            title: "50/30/20の家計黄金比ルール",
            category: "家計管理",
            categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
            summary: "手取り月収を「生活必需品」「自己投資・娯楽」「貯蓄・返済」の3つにシンプル配分する枠組み。",
            content: [
              "50/30/20ルールは、ハーバード大学の破産法学者エリザベス・ウォーレン氏が提唱した、世界中で実践されている直感的な家計管理フレームワークです。",
              "【50% 生活必需品（Needs）】家賃・住宅ローン、食費、光熱費、保険料、最低返済額など、生きていくために削れない必須コストです。",
              "【30% 娯楽・ゆとり（Wants）】外食、趣味、旅行、サブスクリプションなど、人生を豊かにするための柔軟な支出です。",
              "【20% 貯蓄・繰上返済（Savings & Debt）】生活防衛資金の積立、投資、借金の追加繰上返済に充てます。あなたの未来の経済的自由を創る原資です。",
              "【実践のコツ】借金を早期完済したいフェーズでは、「30%の娯楽費」を一時的に20%以下に抑え、その分を「貯蓄・返済」に回すことで爆発的な返済スピードを実現できます。",
            ],
          },
          {
            id: "emergency",
            title: "生活防衛資金（緊急予備資金）の重要性",
            category: "貯蓄戦略",
            categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
            summary: "借金返済を始める前に、なぜ最低3〜6ヶ月分の生活費をプールしておくべきなのか。",
            content: [
              "多くの人が借金返済でリバウンド（再び借金をしてしまうこと）してしまう最大の原因は、「予備資金のない状態で全額を繰上返済に回してしまうこと」です。",
              "【なぜ必要か】病気や怪我、車の故障、家電の故障、急な失業など、予期せぬ出費が発生した際、手元資金がないと再び高金利のクレジットカードやリボ払いに頼るしかなくなってしまいます。",
              "【目標額のステップ】まずは「10万円〜20万円」のミニ緊急資金を最優先で貯めます。その後に借金返済を加速させ、完済後は「生活費の3〜6ヶ月分」まで拡大しましょう。",
              "【保管場所】すぐに引き出せて元本割れしない普通預金口座や高金利ネット銀行に分けて保管するのがベストです。",
            ],
          },
          {
            id: "credit",
            title: "リボ払いとクレジットカード金利の罠",
            category: "金融リテラシー",
            categoryColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
            summary: "年利15%の複利計算の恐ろしさと、「最低支払額」だけを払い続ける危険性。",
            content: [
              "クレジットカードのリボ払いやカードローンの金利は通常「年利15%〜18%」前後です。これは投資の利回り（年利5%〜7%）と比べても異常に高コストです。",
              "【例：50万円をリボ払いにした場合】年利15%で毎月1万円ずつ返済していると、完済までに約79ヶ月（6年半以上）かかり、支払う利息だけで28万円以上（元本の半分以上）に達します！",
              "【最低支払額の罠】カード会社が設定する「ミニマムペイメント（最低支払額）」は、元本がほとんど減らず利息だけを永遠に払い続けさせるように設計されています。",
              "【脱出法】毎月わずか5,000円〜10,000円でも追加返済（繰上返済）を行うだけで、返済期間は数年単位で短縮され、数十万円の利息支払いを防ぐことができます。",
            ],
          },
        ]
      : [
          {
            id: "snowball",
            title: "The Debt Snowball Method",
            category: "Payoff Strategy",
            categoryColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
            summary: "Pay off your smallest balances first to build rapid psychological momentum.",
            content: [
              "The Debt Snowball method focuses on knocking out debts from smallest balance to largest, regardless of interest rates.",
              "How it works: List all debts from smallest balance to largest. Pay minimum payments on every debt except the smallest. Throw all extra funds at the smallest debt until eliminated.",
              "The snowball effect: Once the smallest debt is paid off, roll that entire monthly payment into the next smallest debt. Just like a snowball rolling downhill, your payoff power compounds.",
              "Pros: Delivers quick emotional wins, boosts motivation, and makes consistency easy.",
              "Best for: Anyone who needs visible proof of progress to stay committed for the long haul.",
            ],
          },
          {
            id: "avalanche",
            title: "The Debt Avalanche Method",
            category: "Payoff Strategy",
            categoryColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
            summary: "Target highest-interest rate debts first to mathematically minimize total interest paid.",
            content: [
              "The Debt Avalanche method is the mathematically optimal debt repayment system. You pay off debts strictly in order of highest to lowest interest rate (APR).",
              "How it works: Rank all debts by interest rate. Pay minimums on all debts except the highest-APR debt. Direct every spare dollar to the top-rate balance.",
              "The avalanche effect: Eliminating high-APR debt dramatically slashes the monthly interest charged, freeing up maximum cash flow to crush remaining debts.",
              "Pros: Saves the maximum dollar amount in interest and yields the fastest mathematical path to zero debt.",
              "Best for: People motivated by logic, numbers, and minimizing interest paid to lenders.",
            ],
          },
          {
            id: "budgeting",
            title: "The 50/30/20 Budgeting Rule",
            category: "Budgeting",
            categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
            summary: "A practical framework to divide take-home pay between Needs, Wants, and Savings.",
            content: [
              "The 50/30/20 rule is an intuitive budgeting framework popularized by Harvard bankruptcy expert Elizabeth Warren.",
              "50% Needs: Essential non-negotiables — housing, groceries, utilities, insurance, and minimum debt payments.",
              "30% Wants: Lifestyle choices — dining out, hobbies, subscriptions, shopping, and entertainment.",
              "20% Savings & Debt: Emergency funds, retirement investments, and aggressive extra debt payoff.",
              "Pro tip: While paying off high-interest debt, temporarily scale Wants down to 15-20% and bump Debt Payoff to 30-35%.",
            ],
          },
          {
            id: "emergency",
            title: "Why an Emergency Fund is Critical",
            category: "Savings",
            categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
            summary: "Why you must hold 3–6 months of living expenses before aggressive payoff.",
            content: [
              "Without an emergency fund, unexpected expenses (car repairs, medical emergencies, job changes) force you right back into debt.",
              "Stage 1: Build a starter buffer of $1,000–$2,000 before aggressively accelerating debt payoff.",
              "Stage 2: After debt is conquered, expand your emergency fund to 3–6 months of essential living costs.",
              "Storage: Keep it in a liquid, high-yield savings account separate from your daily checking account.",
            ],
          },
          {
            id: "credit",
            title: "Understanding APR & The Minimum Payment Trap",
            category: "Financial Literacy",
            categoryColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
            summary: "How compound interest works against you and why minimums keep you trapped.",
            content: [
              "Credit card interest rates typically run 20%–25% APR. Interest is calculated daily and compounds rapidly.",
              "The trap: Credit card minimum payments are structured to cover almost entirely interest, keeping borrowers in debt for 15–20+ years.",
              "The escape: Adding even $50 to $100 extra per month cuts payoff time by years and saves thousands of dollars.",
            ],
          },
        ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center shadow-md">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("education.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("education.subtitle")}</p>
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {articles.map((article) => {
          const isOpen = open === article.id;
          return (
            <div
              key={article.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpen(isOpen ? null : article.id)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full w-fit ${article.categoryColor}`}
                  >
                    {article.category}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                    {article.title}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {article.summary}
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {article.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
