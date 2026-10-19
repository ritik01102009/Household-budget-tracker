export type ThemeMode = "light" | "dark" | "system";

export type LanguageCode = "en" | "es" | "fr" | "de" | "hi" | "zh" | "ja" | "ar";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  minPayment: number;
  interestRate: number; // Annual Percentage Rate (APR %)
  category: "credit_card" | "personal_loan" | "student_loan" | "car_loan" | "mortgage" | "medical" | "other";
}

export type DebtStrategy = "snowball" | "avalanche" | "hybrid" | "consolidation";

export interface DebtPayoffMonth {
  month: number;
  year: number;
  monthName: string;
  totalRemaining: number;
  totalInterestPaid: number;
  totalPaid: number;
  debtBalances: Record<string, number>;
}

export interface StrategyResult {
  strategy: DebtStrategy;
  totalMonths: number;
  payoffDate: string;
  totalInterestPaid: number;
  totalAmountPaid: number;
  monthlySchedule: DebtPayoffMonth[];
  payoffOrder: { debtId: string; name: string; paidOffMonth: number }[];
  pros: string[];
  cons: string[];
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  color: string;
}

export interface RecommenderAnswers {
  primaryGoal: "motivation" | "save_money" | "balance" | "simplify";
  extraBudget: number;
  stressLevel: "high" | "medium" | "low";
  creditScore: "poor" | "fair" | "good" | "excellent";
}

export interface RecommendationOutput {
  recommendedStrategy: DebtStrategy;
  titleKey: string;
  reasonKey: string;
  savingsDiff: number;
  timeDiffMonths: number;
  actionableSteps: string[];
}
