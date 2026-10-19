import { Debt, DebtStrategy, StrategyResult, DebtPayoffMonth, RecommenderAnswers, RecommendationOutput } from "./types";

export const DEFAULT_DEBTS: Debt[] = [
  {
    id: "1",
    name: "Credit Card A (Chase)",
    balance: 2400,
    minPayment: 75,
    interestRate: 22.9,
    category: "credit_card",
  },
  {
    id: "2",
    name: "Medical Bill",
    balance: 850,
    minPayment: 50,
    interestRate: 0,
    category: "medical",
  },
  {
    id: "3",
    name: "Personal Loan",
    balance: 5500,
    minPayment: 160,
    interestRate: 11.5,
    category: "personal_loan",
  },
  {
    id: "4",
    name: "Credit Card B (Discover)",
    balance: 3800,
    minPayment: 110,
    interestRate: 19.5,
    category: "credit_card",
  },
  {
    id: "5",
    name: "Car Loan",
    balance: 12000,
    minPayment: 280,
    interestRate: 5.4,
    category: "car_loan",
  },
];

export function calculateDebtStrategy(
  debts: Debt[],
  extraMonthlyPayment: number,
  strategy: DebtStrategy
): StrategyResult {
  if (debts.length === 0) {
    return {
      strategy,
      totalMonths: 0,
      payoffDate: new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" }),
      totalInterestPaid: 0,
      totalAmountPaid: 0,
      monthlySchedule: [],
      payoffOrder: [],
      pros: [],
      cons: [],
    };
  }

  // Deep clone debts to mutate balances
  let activeDebts = debts.map((d) => ({
    ...d,
    currentBalance: d.balance,
  }));

  const totalMinPayment = activeDebts.reduce((sum, d) => sum + d.minPayment, 0);
  const totalMonthlyBudget = totalMinPayment + extraMonthlyPayment;

  // Sorting priority based on strategy
  const sortDebts = (list: typeof activeDebts, currentStrategy: DebtStrategy) => {
    return [...list].sort((a, b) => {
      if (a.currentBalance <= 0) return 1;
      if (b.currentBalance <= 0) return -1;

      if (currentStrategy === "snowball") {
        return a.currentBalance - b.currentBalance; // Smallest balance first
      } else if (currentStrategy === "avalanche") {
        return b.interestRate - a.interestRate; // Highest interest rate first
      } else if (currentStrategy === "hybrid") {
        // Hybrid: If there's a debt < $1000, target smallest balance first, else highest APR
        const aIsSmall = a.currentBalance <= 1500;
        const bIsSmall = b.currentBalance <= 1500;
        if (aIsSmall && !bIsSmall) return -1;
        if (!aIsSmall && bIsSmall) return 1;
        return b.interestRate - a.interestRate;
      } else {
        // Consolidation mode uses weighted average rate
        return b.interestRate - a.interestRate;
      }
    });
  };

  const monthlySchedule: DebtPayoffMonth[] = [];
  const payoffOrder: { debtId: string; name: string; paidOffMonth: number }[] = [];
  let monthCount = 0;
  let accumulatedInterest = 0;
  let accumulatedPaid = 0;

  const startDate = new Date();
  const maxMonths = 360; // 30 year safety cap

  while (activeDebts.some((d) => d.currentBalance > 0.01) && monthCount < maxMonths) {
    monthCount++;
    const currentMonthDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthCount, 1);
    const monthName = currentMonthDate.toLocaleDateString(undefined, { month: "short", year: "numeric" });

    let unallocatedBudget = totalMonthlyBudget;
    const balancesThisMonth: Record<string, number> = {};

    // 1. Accrue interest & pay minimums first
    for (const debt of activeDebts) {
      if (debt.currentBalance > 0) {
        const monthlyInterest = (debt.currentBalance * (debt.interestRate / 100)) / 12;
        debt.currentBalance += monthlyInterest;
        accumulatedInterest += monthlyInterest;

        const minPay = Math.min(debt.currentBalance, debt.minPayment);
        debt.currentBalance -= minPay;
        accumulatedPaid += minPay;
        unallocatedBudget -= minPay;

        if (debt.currentBalance <= 0.01) {
          debt.currentBalance = 0;
          if (!payoffOrder.some((p) => p.debtId === debt.id)) {
            payoffOrder.push({ debtId: debt.id, name: debt.name, paidOffMonth: monthCount });
          }
        }
      }
    }

    // 2. Allocate extra budget according to current strategy
    const sorted = sortDebts(activeDebts, strategy);
    for (const debt of sorted) {
      if (debt.currentBalance > 0 && unallocatedBudget > 0) {
        const extraPay = Math.min(debt.currentBalance, unallocatedBudget);
        debt.currentBalance -= extraPay;
        accumulatedPaid += extraPay;
        unallocatedBudget -= extraPay;

        if (debt.currentBalance <= 0.01) {
          debt.currentBalance = 0;
          if (!payoffOrder.some((p) => p.debtId === debt.id)) {
            payoffOrder.push({ debtId: debt.id, name: debt.name, paidOffMonth: monthCount });
          }
        }
      }
    }

    // Record balances for chart
    let totalRemaining = 0;
    activeDebts.forEach((d) => {
      balancesThisMonth[d.name] = Math.round(d.currentBalance);
      totalRemaining += d.currentBalance;
    });

    monthlySchedule.push({
      month: monthCount,
      year: currentMonthDate.getFullYear(),
      monthName,
      totalRemaining: Math.round(totalRemaining),
      totalInterestPaid: Math.round(accumulatedInterest),
      totalPaid: Math.round(accumulatedPaid),
      debtBalances: balancesThisMonth,
    });
  }

  const finalDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthCount, 1);
  const payoffDateStr = finalDate.toLocaleDateString(undefined, { month: "short", year: "numeric" });

  const prosConsMap: Record<DebtStrategy, { pros: string[]; cons: string[] }> = {
    snowball: {
      pros: [
        "Quick mental wins by clearing small debts fast",
        "Keeps motivation high early in the journey",
        "Frees up minimum payments fast to snowball into next debt",
      ],
      cons: [
        "May cost slightly more in total interest than Avalanche",
        "High interest rate debts might take longer to address",
      ],
    },
    avalanche: {
      pros: [
        "Mathematically optimal - saves the maximum amount of interest",
        "Shortens overall payoff timeline as fast as possible",
        "Best strategy for high APR credit card debt",
      ],
      cons: [
        "First debt payoff may take longer if balance is large",
        "Requires discipline without early quick wins",
      ],
    },
    hybrid: {
      pros: [
        "Best of both worlds: quick win first, then interest optimization",
        "High motivation combined with strong interest savings",
        "Flexible approach adaptable to personal financial stress",
      ],
      cons: [
        "Slightly more complex to track manual switching criteria",
      ],
    },
    consolidation: {
      pros: [
        "Simplifies multiple debts into a single monthly payment",
        "Lowers overall average interest rate",
        "Fixed monthly payoff timeline with predictable budget",
      ],
      cons: [
        "Requires credit approval for a low-rate loan or balance transfer",
        "Risk of running up credit card balances again if not disciplined",
      ],
    },
  };

  return {
    strategy,
    totalMonths: monthCount,
    payoffDate: payoffDateStr,
    totalInterestPaid: Math.round(accumulatedInterest),
    totalAmountPaid: Math.round(accumulatedPaid),
    monthlySchedule,
    payoffOrder,
    pros: prosConsMap[strategy].pros,
    cons: prosConsMap[strategy].cons,
  };
}

export function generateSmartRecommendation(
  debts: Debt[],
  extraPayment: number,
  answers: RecommenderAnswers
): RecommendationOutput {
  const snowballRes = calculateDebtStrategy(debts, extraPayment, "snowball");
  const avalancheRes = calculateDebtStrategy(debts, extraPayment, "avalanche");
  const hybridRes = calculateDebtStrategy(debts, extraPayment, "hybrid");

  const savingsDiff = Math.max(0, snowballRes.totalInterestPaid - avalancheRes.totalInterestPaid);
  const timeDiffMonths = Math.max(0, snowballRes.totalMonths - avalancheRes.totalMonths);

  let recommendedStrategy: DebtStrategy = "avalanche";
  let titleKey = "rec_avalanche_title";
  let reasonKey = "rec_avalanche_reason";
  let actionableSteps: string[] = [];

  if (answers.primaryGoal === "motivation" || answers.stressLevel === "high") {
    recommendedStrategy = "snowball";
    titleKey = "rec_snowball_title";
    reasonKey = "rec_snowball_reason";
    actionableSteps = [
      "Pay minimums on all accounts automatically.",
      `Throw your entire $${extraPayment} extra budget towards your smallest balance debt first.`,
      "Celebrate each cleared account to build momentum!",
    ];
  } else if (answers.primaryGoal === "balance") {
    recommendedStrategy = "hybrid";
    titleKey = "rec_hybrid_title";
    reasonKey = "rec_hybrid_reason";
    actionableSteps = [
      "Target any debt under $1,500 first for a fast win.",
      "Immediately switch all extra funds to your highest APR credit card.",
      "Re-evaluate strategy every 6 months as balances drop.",
    ];
  } else if (answers.primaryGoal === "simplify" && (answers.creditScore === "good" || answers.creditScore === "excellent")) {
    recommendedStrategy = "consolidation";
    titleKey = "rec_consolidation_title";
    reasonKey = "rec_consolidation_reason";
    actionableSteps = [
      "Shop for a 0% APR Balance Transfer Card or Personal Consolidation Loan (aim for < 10% APR).",
      "Consolidate your high-interest credit cards into 1 single monthly bill.",
      "Close or lock high-fee credit cards to avoid building fresh debt.",
    ];
  } else {
    recommendedStrategy = "avalanche";
    titleKey = "rec_avalanche_title";
    reasonKey = "rec_avalanche_reason";
    actionableSteps = [
      "Order all debts strictly from highest interest rate (APR %) to lowest.",
      `Apply your full $${extraPayment} extra payment to the debt with the highest APR.`,
      `You will save approx $${savingsDiff.toLocaleString()} in interest compared to Snowball method!`,
    ];
  }

  return {
    recommendedStrategy,
    titleKey,
    reasonKey,
    savingsDiff,
    timeDiffMonths,
    actionableSteps,
  };
}

export function formatCurrency(amount: number, currencySymbol: string = "$"): string {
  return `${currencySymbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
