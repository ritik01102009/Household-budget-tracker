"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "ja" | "en";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const translations: Record<SupportedLanguage, Record<string, any>> = {
  ja: {
    app: {
      name: "家計管理",
      tagline: "スマートな財務自由化エンジン",
    },
    nav: {
      dashboard: "ダッシュボード",
      debt: "借金返済シミュレーター",
      recommender: "最適返済診断",
      budget: "家計簿・予算管理",
      savings: "貯蓄目標トラッカー",
      subscriptions: "サブスク見直し計算機",
      education: "金融ナレッジ",
      theme_toggle: "テーマ切替",
      lang_toggle: "言語切替 (現在: 日本語)",
    },
    hero: {
      badge: "完全無料 · プライバシー保護 · 登録不要",
      title_lead: "お金の流れを完全に",
      title_highlight: "コントロール",
      description: "究極の無料借金返済計算ツール＆予算管理アプリ。雪だるま式（スノーボール）と雪崩式（アバランチ）を比較し、最短で経済的自由を実現しましょう。",
      start_debt: "借金計算をはじめる",
      find_method: "最適返済法を診断する",
    },
    stats: {
      avg_debt_label: "世帯平均負債額",
      avg_debt_sub: "（米国参考データ）",
      apr_label: "リボ・カード平均金利",
      apr_sub: "年率換算",
      speed_label: "返済期間の短縮効果",
      speed_sub: "最適な返済戦略の適用時",
    },
    tools: {
      section_title: "ファイナンシャル・ツール一覧",
      section_desc: "借金完済から毎月の貯蓄まで、あなたの資産形成を強力にサポートします",
      debt: {
        title: "借金返済シミュレーター",
        desc: "スノーボール法とアバランチ法をリアルタイム比較。完済予定日と利息削減額を可視化します。",
      },
      recommender: {
        title: "最適返済メソッド診断",
        desc: "簡単な4つの質問に答えるだけで、あなたに一番合った返済戦略をAI診断します。",
      },
      budget: {
        title: "家計簿・予算トラッカー",
        desc: "月収と支出カテゴリを管理。無駄遣いを防ぎ、手元に残る金額を明確にします。",
      },
      savings: {
        title: "貯蓄目標トラッカー",
        desc: "非常時資金や旅行、車の購入目標を設定し、達成までの進捗を追跡します。",
      },
      subscriptions: {
        title: "サブスク見直し計算機",
        desc: "毎月・年間の固定費を一覧化。不要なサブスクリプションを削減して節約しましょう。",
      },
      education: {
        title: "金融ガイド・学習",
        desc: "スノーボール法、アバランチ法、50/30/20ルールなど実践的な金融知識を解説。",
      },
    },
    debt: {
      title: "借金返済シミュレーター",
      subtitle: "スノーボール方式（小口優先） vs アバランチ方式（高金利優先）の比較",
      total_debt: "負債総額",
      min_payments: "毎月の最低返済額",
      payoff_time: "完済までの期間",
      months: "ヶ月",
      total_interest: "総利息支払額",
      strategy_label: "返済戦略",
      snowball: "スノーボール方式",
      avalanche: "アバランチ方式",
      extra_payment: "追加の毎月返済額",
      current_active: "選択中",
      your_debts: "登録された負債一覧",
      add_debt: "借入を追加",
      debt_name_placeholder: "借入名（例: クレジットカード）",
      balance: "残高",
      apr: "年利 (%)",
      min_pay: "毎月最低支払",
      delete: "削除",
      months_suffix: "ヶ月で完済",
      interest_suffix: "利息合計",
      snowball_desc: "残高が小さい順に返済し、小さな達成感を積み重ねます。",
      avalanche_desc: "金利が高い順に返済し、支払う利息総額を最小限に抑えます。",
    },
    recommender: {
      title: "最適返済メソッド診断",
      subtitle: "あなたにぴったりの返済計画をわずか1分で提案します",
      step: "質問",
      of: "/",
      retake: "診断をやり直す",
      recommended_result: "あなたにおすすめの返済方法",
      start_with: "この戦略で始める",
    },
    budget: {
      title: "家計簿・予算トラッカー",
      subtitle: "月収と支出カテゴリを整理し、黒字家計をつくりましょう",
      monthly_income: "毎月の手取り月収",
      total_budgeted: "予算設定合計",
      total_spent: "支出実績合計",
      remaining: "今月の残り残高",
      categories: "支出カテゴリ一覧",
      add_category: "カテゴリ追加",
      name_placeholder: "カテゴリ名（例: 食費、家賃）",
      budgeted: "予算枠",
      spent: "支出額",
      over_budget: "予算オーバー",
      within_budget: "予算内",
    },
    savings: {
      title: "貯蓄目標トラッカー",
      subtitle: "目標金額と毎月の積立額から達成時期を予測します",
      total_saved: "現在の貯蓄総額",
      total_target: "目標総額",
      overall_progress: "全体の達成率",
      monthly_saving: "毎月の積立可能額",
      goals_list: "あなたの貯蓄目標",
      add_goal: "目標を追加",
      goal_name_placeholder: "目標名（例: 緊急予備資金、ハワイ旅行）",
      target_amount: "目標金額",
      current_amount: "現在の貯金額",
      eta: "達成予測",
      completed: "達成済み！🎉",
      months_to_go: "ヶ月後",
    },
    subs: {
      title: "サブスク見直し計算機",
      subtitle: "月額・年額の契約サービスを棚卸しして無駄をカット",
      active_count: "契約中のサブスク",
      monthly_cost: "月間合計コスト",
      yearly_cost: "年間合計コスト",
      inactive_count: "停止・解約済み",
      category_breakdown: "カテゴリ別月間支出",
      all_subs: "サブスクリプション一覧",
      add_sub: "サブスクを追加",
      sub_name_placeholder: "サービス名（例: Netflix, Spotify）",
      cost: "料金",
      monthly: "月払い",
      yearly: "年払い",
      category: "カテゴリ",
      active: "有効",
      paused: "停止中",
    },
    education: {
      title: "金融ガイド・知識ベース",
      subtitle: "借金ゼロと経済的自立を加速させる実証済みのマネー戦略",
      read_more: "詳細を読む",
    },
    footer: {
      brand_description: "完全無料＆安全な借金返済シミュレーター兼家計簿アプリ。アカウント登録不要、データはすべてお使いの端末にのみ保存されます。",
      privacy: "100%クライアント処理 — 入力データは外部送信されません",
      copyright: "家計管理 — スマート財務自由化エンジン。All rights reserved.",
      built_for: "借金のない明るい未来のために",
      tools_heading: "ツール",
      learn_heading: "学習",
      features_heading: "特長",
      dashboard_heading: "ダッシュボード",
      pdf_export: "PDFレポート出力",
      multi_language: "多言語対応（日/英）",
      strategy_compare: "返済シミュレーション比較",
      privacy_first: "安心のプライバシー設計",
    },
    faq: {
      title: "よくある質問 (FAQ)",
      q1: "支出データをPDFで出力できますか？",
      a1: "はい、できます。レポート画面から期間を選び、PDFを選択してください。家計簿 エクセル 形式やCSV形式でのエクスポートにも対応しており、自由にデータを活用できます。",
      q2: "PDFレポートにはどんな内容が含まれますか？",
      a2: "カテゴリ別の合計、月別サマリー、グラフ、明細一覧が含まれます。出力する項目は選択可能で、家計簿 印刷 無料 ツールとしても便利にお使いいただけます。",
      q3: "レシートをPDFで保存したり、PDFを明細に添付したりできますか？",
      a3: "現在は未対応です。日々の 支出管理 や 収支管理 は、直感的なインターフェースから直接入力する形式を採用しています。",
      q4: "銀行・カードの明細PDFを取り込めますか？",
      a4: "現在は未対応です。CSV取り込みをご利用ください。この 家計簿 無料 ツールは、データの手軽な入力と分析に特化しています。",
      q5: "PDFは確定申告に使えますか？",
      a5: "支出管理 無料 ツールとして収支の確認や整理には役立ちますが、申告に必要な帳簿や正式な書類の代わりにはなりません。参考資料としてご利用ください。",
      q6: "PDFの日本語が文字化けしたり、表示されなかったりします。",
      a6: "ブラウザを最新版に更新してから、もう一度出力してください。この 家計簿 web アプリは最新のブラウザ環境で最適に動作します。",
      q7: "パソコンでも利用できますか？",
      a7: "はい。Web版の 家計簿 として、パソコンからでも快適にご利用いただけます。家計簿 テンプレート を探す必要もなく、ブラウザですぐに始められます。",
      q8: "スマホとパソコンでデータは同期されますか？",
      a8: "いいえ、データはすべてご利用の端末のブラウザにのみ保存されます。プライバシーを完全に保護する 家計簿 アプリ 無料 ツールのため、クラウドでの同期は行われません。",
      q9: "対応しているブラウザやOSを教えてください。",
      a9: "Chrome、Edge、Safari、Firefox の最新版に対応しています。日々の記録だけでなく、貯金 計算 や 貯金シミュレーション もブラウザ上でスムーズに動作します。",
      q10: "データを印刷したり、パソコンのファイルを取り込んだりできますか？",
      a10: "はい。レポート画面またはPDFから 家計簿 の印刷ができます。また、CSVファイルを取り込んで過去のデータを統合することも可能です。"
    },
  },
  en: {
    app: {
      name: "家計管理",
      tagline: "Smart Financial Freedom Engine",
    },
    nav: {
      dashboard: "Dashboard",
      debt: "Debt Calculator",
      recommender: "Method Finder",
      budget: "Budget Tracker",
      savings: "Savings Goals",
      subscriptions: "Subscriptions",
      education: "Learn",
      theme_toggle: "Toggle theme",
      lang_toggle: "Change language (Current: English)",
    },
    hero: {
      badge: "100% Free · Private · No Account Needed",
      title_lead: "Take Full Control of Your",
      title_highlight: "Finances",
      description: "The ultimate free debt payoff calculator and budget tracker. Compare Snowball vs Avalanche strategies, eliminate high-interest debt, and achieve financial freedom faster.",
      start_debt: "Start Debt Calculator",
      find_method: "Find Your Best Strategy",
    },
    stats: {
      avg_debt_label: "Average Household Debt",
      avg_debt_sub: "US national average",
      apr_label: "Average Credit Card APR",
      apr_sub: "Annual percentage rate",
      speed_label: "Faster to Debt Freedom",
      speed_sub: "With the right payoff strategy",
    },
    tools: {
      section_title: "Financial Toolkit",
      section_desc: "Everything you need to eliminate debt, optimize spending, and build lasting wealth",
      debt: {
        title: "Debt Payoff Calculator",
        desc: "Compare Snowball vs Avalanche methods in real time. Know your exact debt-free date and total interest saved.",
      },
      recommender: {
        title: "Smart Method Finder",
        desc: "Answer 4 simple questions to receive a personalized debt reduction strategy tailored to your habits.",
      },
      budget: {
        title: "Budget Tracker",
        desc: "Monitor your income versus category expenses. Take control of where every single dollar goes.",
      },
      savings: {
        title: "Savings Goals Tracker",
        desc: "Set emergency fund, vacation, or big purchase targets and watch your milestones turn into reality.",
      },
      subscriptions: {
        title: "Subscription Calculator",
        desc: "Audit monthly and annual recurring fees. Spot unused subscriptions and reclaim your cash flow.",
      },
      education: {
        title: "Financial Education",
        desc: "Master proven financial strategies including Snowball, Avalanche, and the 50/30/20 budgeting rule.",
      },
    },
    debt: {
      title: "Debt Payoff Calculator",
      subtitle: "Compare Snowball (smallest balance first) vs Avalanche (highest interest first)",
      total_debt: "Total Debt",
      min_payments: "Monthly Min. Payments",
      payoff_time: "Time to Debt-Free",
      months: "mo",
      total_interest: "Total Interest Paid",
      strategy_label: "Payoff Strategy",
      snowball: "Snowball Method",
      avalanche: "Avalanche Method",
      extra_payment: "Extra Monthly Payment",
      current_active: "Active",
      your_debts: "Your Debts",
      add_debt: "Add Debt",
      debt_name_placeholder: "Debt name (e.g. Credit Card)",
      balance: "Balance",
      apr: "APR (%)",
      min_pay: "Min. Pay",
      delete: "Delete",
      months_suffix: "months to payoff",
      interest_suffix: "total interest",
      snowball_desc: "Tackles smallest balance first to build early psychological momentum.",
      avalanche_desc: "Tackles highest interest rate first to minimize total money paid to interest.",
    },
    recommender: {
      title: "Smart Method Finder",
      subtitle: "Find your ideal payoff roadmap in under 1 minute",
      step: "Question",
      of: "/",
      retake: "Retake Quiz",
      recommended_result: "Your Recommended Strategy",
      start_with: "Start with this Strategy",
    },
    budget: {
      title: "Budget Tracker",
      subtitle: "Organize income and expense categories to maintain a healthy surplus",
      monthly_income: "Monthly Take-Home Income",
      total_budgeted: "Total Budgeted",
      total_spent: "Total Spent",
      remaining: "Remaining Cash Flow",
      categories: "Expense Categories",
      add_category: "Add Category",
      name_placeholder: "Category name (e.g. Groceries, Rent)",
      budgeted: "Budget",
      spent: "Spent",
      over_budget: "Over Budget",
      within_budget: "Within Budget",
    },
    savings: {
      title: "Savings Goals Tracker",
      subtitle: "Track milestones and project completion dates with regular contributions",
      total_saved: "Total Saved",
      total_target: "Total Target",
      overall_progress: "Overall Progress",
      monthly_saving: "Available Monthly Savings",
      goals_list: "Your Savings Goals",
      add_goal: "Add Goal",
      goal_name_placeholder: "Goal name (e.g. Emergency Fund, Trip)",
      target_amount: "Target Amount",
      current_amount: "Current Saved",
      eta: "Estimated ETA",
      completed: "Completed! 🎉",
      months_to_go: "months left",
    },
    subs: {
      title: "Subscription Calculator",
      subtitle: "Audit and eliminate unused recurring monthly and annual costs",
      active_count: "Active Services",
      monthly_cost: "Monthly Cost",
      yearly_cost: "Yearly Cost",
      inactive_count: "Paused / Inactive",
      category_breakdown: "Monthly Cost by Category",
      all_subs: "All Subscriptions",
      add_sub: "Add Subscription",
      sub_name_placeholder: "Service name (e.g. Netflix, Spotify)",
      cost: "Cost",
      monthly: "Monthly",
      yearly: "Yearly",
      category: "Category",
      active: "Active",
      paused: "Paused",
    },
    education: {
      title: "Financial Knowledge Base",
      subtitle: "Proven principles to accelerate your journey to complete financial independence",
      read_more: "Read Guide",
    },
    footer: {
      brand_description: "The free, client-side debt payoff calculator and budget tracker. No account needed. No tracking. Just pure financial clarity.",
      privacy: "100% Client-Side — Your financial numbers never leave your browser",
      copyright: "家計管理 — Smart Financial Freedom Engine. All rights reserved.",
      built_for: "Built for debt-free futures",
      tools_heading: "Tools",
      learn_heading: "Learn",
      features_heading: "Features",
      dashboard_heading: "Dashboard",
      pdf_export: "PDF Report Export",
      multi_language: "Multi-Language Support (JA / EN)",
      strategy_compare: "Strategy Comparison",
      privacy_first: "Privacy-First Architecture",
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "Can I export expense data as a PDF?",
      a1: "Yes, you can. Select the period from the report screen and choose PDF. We also support Excel (家計簿 エクセル) and CSV exports so you can use the data freely.",
      q2: "What is included in the PDF report?",
      a2: "It includes category totals, monthly summaries, graphs, and transaction lists. You can select which items to export, making it convenient as a free printable household account book (家計簿 印刷 無料).",
      q3: "Can I save receipts as PDFs or attach PDFs to transactions?",
      a3: "Currently, this is not supported. Daily expense management (支出管理) and income/expense tracking (収支管理) are done via direct input through our intuitive interface.",
      q4: "Can I import bank or credit card statement PDFs?",
      a4: "Currently, this is not supported. Please use CSV import. This free household account book (家計簿 無料) tool is specialized in easy data entry and analysis.",
      q5: "Can the PDF be used for tax returns?",
      a5: "While it is useful for confirming and organizing your income and expenses as a free expense management (支出管理 無料) tool, it does not replace the official books or documents required for tax filing.",
      q6: "Japanese characters in the PDF are garbled or not displaying.",
      a6: "Please update your browser to the latest version and try exporting again. This web household account book (家計簿 web) app works best on modern browsers.",
      q7: "Can I use it on a computer?",
      a7: "Yes. You can comfortably use it from your PC as a web-based household account book (家計簿). You don't need to look for a template (家計簿 テンプレート); just start right in your browser.",
      q8: "Does the data sync between my phone and computer?",
      a8: "No, all data is saved only in the browser of the device you are using. Since it is a free household account app (家計簿 アプリ 無料) that fully protects your privacy, we do not sync via the cloud.",
      q9: "What browsers and OS are supported?",
      a9: "It supports the latest versions of Chrome, Edge, Safari, and Firefox. Not only daily logging but also savings calculation (貯金 計算) and savings simulation (貯金シミュレーション) run smoothly in your browser.",
      q10: "Can I print data or import files from my computer?",
      a10: "Yes. You can print the household account book (家計簿) from the report screen or PDF. You can also import CSV files to integrate past data."
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is Japanese ("ja") as requested
  const [language, setLanguageState] = useState<SupportedLanguage>("ja");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("spensensie_language") as SupportedLanguage | null;
    if (saved && (saved === "en" || saved === "ja")) {
      setLanguageState(saved);
      document.documentElement.setAttribute("lang", saved);
    } else {
      document.documentElement.setAttribute("lang", "ja");
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("spensensie_language", lang);
    document.documentElement.setAttribute("lang", lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja");
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English if key missing in target language
        let fallback: any = translations["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            fallback = key;
            break;
          }
        }
        current = fallback;
        break;
      }
    }

    // Safety guard: NEVER return an object to React JSX children
    if (typeof current === "object" || current === undefined || current === null) {
      return key;
    }

    return String(current);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}