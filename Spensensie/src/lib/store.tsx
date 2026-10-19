"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  isVerified?: boolean;
};

export type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  date: string;
  note?: string;
  isRecurring: boolean;
};

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  readTime: string;
  author: string;
  publishedAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type SavedCalculation = {
  id: string;
  type: "MEMBERSHIP" | "DEBT";
  title: string;
  date: string;
  details: any;
};

export type BudgetLimit = {
  category: string;
  limit: number;
};

type AppStateContextType = {
  user: User | null;
  loginUser: (email: string, role?: "USER" | "ADMIN") => boolean;
  registerUser: (name: string, email: string) => void;
  logoutUser: () => void;
  updateProfile: (name: string, email: string, avatar?: string, role?: "USER" | "ADMIN") => void;
  language: string;
  setLanguage: (lang: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  fundGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, "id" | "publishedAt">) => void;
  deleteBlogPost: (id: string) => void;
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, "id" | "isRead" | "createdAt">) => void;
  markMessageRead: (id: string) => void;
  faqs: FAQ[];
  addFAQ: (faq: Omit<FAQ, "id">) => void;
  deleteFAQ: (id: string) => void;
  savedCalculations: SavedCalculation[];
  saveCalculation: (calc: Omit<SavedCalculation, "id" | "date">) => void;
  deleteCalculation: (id: string) => void;
  budgetLimits: BudgetLimit[];
  setBudgetLimit: (category: string, limit: number) => void;
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Rich Initial Sample Data
const DEFAULT_FAQS: FAQ[] = [
  { id: "faq-1", question: "Is SpendSensie secure?", answer: "Yes! All calculations are processed on-device, and your data is stored locally in your browser's secure storage.", category: "General" },
  { id: "faq-2", question: "How do I choose between Snowball and Avalanche debt strategies?", answer: "The Snowball strategy focuses on quick wins by paying off the smallest balances first to build momentum. Avalanche targets the highest interest rates first to minimize interest paid. SpendSensie lets you compare both side-by-side!", category: "Calculators" },
  { id: "faq-3", question: "Can I export my financial data?", answer: "Absolutely. SpendSensie allows you to export your budgets, transactions, and reports as CSV, Excel (JSON format), or print them directly to PDF.", category: "Features" },
  { id: "faq-4", question: "Is SpendSensie free?", answer: "Yes! The core calculators and budget tools are completely free to use. Premium memberships unlock advanced goals, report exports, and custom category budgets.", category: "Billing" }
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "5-steps-first-budget",
    title: "5 Simple Steps to Create Your First Budget",
    excerpt: "Learn how to take control of your spending by building a simple, sustainable budget structure.",
    content: "Creating a budget doesn't mean restricting your freedom—it means taking control of where your money goes. Here is how to get started:\n\n1. Calculate Net Income: Know exactly how much money lands in your account after taxes.\n2. Track Your Expenses: Group expenses into fixed costs (rent, utilities) and variable costs (dining, entertainment).\n3. Set Goals: Allocate funds for emergency savings and debt repayment first.\n4. Apply the 50/30/20 Rule: 50% for Needs, 30% for Wants, and 20% for Savings/Debt.\n5. Adjust and Review: Markets and lifestyles change, so check your budget monthly.\n\nFollowing these simple rules will put you on the path to financial stability.",
    category: "Budgeting",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
    readTime: "4 min read",
    author: "Elena Vance",
    publishedAt: "2026-06-25T10:00:00.000Z"
  },
  {
    id: "blog-2",
    slug: "snowball-vs-avalanche-debt",
    title: "Snowball vs. Avalanche: Which Debt Strategy is Best?",
    excerpt: "Compare the psychological and mathematical approaches to paying off debt quickly.",
    content: "When tackling credit card or loan balances, two systems stand out: Snowball and Avalanche.\n\n- The Snowball Method: You pay off your smallest debts first, regardless of interest rates. This builds psychological momentum as you cross debts off your list rapidly.\n- The Avalanche Method: You list debts by interest rate and pay off the highest rate first. This is mathematically optimal and saves the most money in interest charges.\n\nWhich should you choose? If you struggle with motivation, go with the Snowball. If you want to pay the absolute least interest, choose the Avalanche. SpendSensie's calculator compares both for your unique debts.",
    category: "Debt Payoff",
    imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&auto=format&fit=crop&q=60",
    readTime: "5 min read",
    author: "Marcus Aurelius",
    publishedAt: "2026-06-28T14:30:00.000Z"
  },
  {
    id: "blog-3",
    slug: "power-of-compound-interest",
    title: "The Power of Compound Interest Explained",
    excerpt: "Discover how investing small amounts early can generate massive long-term wealth.",
    content: "Albert Einstein reportedly called compound interest the eighth wonder of the world. Here's why: compounding happens when you earn interest on both your original investment and the interest that investment has already earned.\n\nImagine investing $500 monthly at an 8% expected annual return. In 10 years, you will have contributed $60,000, but your account will be worth about $92,000. In 30 years, you'll have contributed $180,000, and it will be worth over $700,000! Time is your greatest asset. Start today, even with small amounts, to maximize growth.",
    category: "Investing",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60",
    readTime: "6 min read",
    author: "Sarah Jenkins",
    publishedAt: "2026-07-01T09:15:00.000Z"
  }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", type: "INCOME", amount: 4800, category: "Salary", date: "2026-07-01", note: "Monthly corporate salary", isRecurring: true },
  { id: "tx-2", type: "INCOME", amount: 650, category: "Freelance", date: "2026-07-03", note: "UI Design Project", isRecurring: false },
  { id: "tx-3", type: "EXPENSE", amount: 1200, category: "Housing", date: "2026-07-01", note: "Appartment rent", isRecurring: true },
  { id: "tx-4", type: "EXPENSE", amount: 145, category: "Utilities", date: "2026-07-02", note: "Electricity & Gas", isRecurring: true },
  { id: "tx-5", type: "EXPENSE", amount: 85, category: "Internet & Phone", date: "2026-07-02", note: "GigaFiber + mobile plan", isRecurring: true },
  { id: "tx-6", type: "EXPENSE", amount: 230, category: "Food & Grocery", date: "2026-07-02", note: "Weekly grocery restock", isRecurring: false },
  { id: "tx-7", type: "EXPENSE", amount: 65, category: "Dining Out", date: "2026-07-02", note: "Sushi night with friends", isRecurring: false },
  { id: "tx-8", type: "EXPENSE", amount: 60, category: "Transportation", date: "2026-07-03", note: "Gas refill", isRecurring: false },
  { id: "tx-9", type: "EXPENSE", amount: 120, category: "Insurance", date: "2026-07-01", note: "Health & car insurance", isRecurring: true },
  { id: "tx-10", type: "EXPENSE", amount: 45, category: "Shopping", date: "2026-07-03", note: "New books on finance", isRecurring: false },
  { id: "tx-11", type: "EXPENSE", amount: 29.99, category: "Entertainment", date: "2026-07-01", note: "Streaming services subscriptions", isRecurring: true },
  { id: "tx-12", type: "EXPENSE", amount: 500, category: "Savings", date: "2026-07-01", note: "High yield savings transfer", isRecurring: true },
  { id: "tx-13", type: "EXPENSE", amount: 300, category: "Investments", date: "2026-07-02", note: "SIP index fund portfolio", isRecurring: true },
  { id: "tx-14", type: "EXPENSE", amount: 150, category: "Debt Payments", date: "2026-07-02", note: "Credit card repayment", isRecurring: true },
  { id: "tx-15", type: "EXPENSE", amount: 40, category: "Miscellaneous", date: "2026-07-03", note: "Coffee and snacks", isRecurring: false }
];

const DEFAULT_GOALS: Goal[] = [
  { id: "g-1", title: "Emergency Fund", targetAmount: 10000, currentAmount: 6500, category: "Savings", targetDate: "2026-12-31" },
  { id: "g-2", title: "Buy a Car", targetAmount: 25000, currentAmount: 8000, category: "Investments", targetDate: "2027-06-30" },
  { id: "g-3", title: "Euro Vacation", targetAmount: 5000, currentAmount: 3200, category: "Travel", targetDate: "2026-09-15" },
  { id: "g-4", title: "Retirement Goal", targetAmount: 250000, currentAmount: 38000, category: "Retirement", targetDate: "2045-01-01" }
];

const DEFAULT_BUDGETS: BudgetLimit[] = [
  { category: "Housing", limit: 1200 },
  { category: "Food & Grocery", limit: 500 },
  { category: "Dining Out", limit: 200 },
  { category: "Shopping", limit: 300 },
  { category: "Entertainment", limit: 100 },
  { category: "Transportation", limit: 200 }
];

const DEFAULT_MESSAGES: ContactMessage[] = [
  { id: "m-1", name: "David Miller", email: "david.miller@gmail.com", subject: "Partnership Opportunity", message: "Hello SpendSensie Team, we would love to discuss integrating our financial advising API with your calculators.", isRead: false, createdAt: "2026-07-02T16:20:00.000Z" },
  { id: "m-2", name: "Alice Cooper", email: "alice.c@live.com", subject: "Love the Debt Tool!", message: "Just wanted to let you know that the side-by-side comparison of Snowball and Avalanche helped me pay off my credit card 4 months early!", isRead: true, createdAt: "2026-07-03T10:10:00.000Z" }
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [language, setLanguageState] = useState<string>("en");

  // Load state from localStorage on mount
  useEffect(() => {
    const localUser = localStorage.getItem("ss_user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      // Default dummy user logged in
      const defaultUser: User = {
        id: "usr-default",
        name: "Alex Sterling",
        email: "alex@spendsensie.com",
        role: "ADMIN", // Admin by default for testing purposes
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60",
        isVerified: true
      };
      setUser(defaultUser);
      localStorage.setItem("ss_user", JSON.stringify(defaultUser));
    }

    const localTransactions = localStorage.getItem("ss_transactions");
    setTransactions(localTransactions ? JSON.parse(localTransactions) : DEFAULT_TRANSACTIONS);

    const localGoals = localStorage.getItem("ss_goals");
    setGoals(localGoals ? JSON.parse(localGoals) : DEFAULT_GOALS);

    const localBlogs = localStorage.getItem("ss_blogs");
    setBlogPosts(localBlogs ? JSON.parse(localBlogs) : DEFAULT_BLOGS);

    const localMessages = localStorage.getItem("ss_messages");
    setContactMessages(localMessages ? JSON.parse(localMessages) : DEFAULT_MESSAGES);

    const localFaqs = localStorage.getItem("ss_faqs");
    setFaqs(localFaqs ? JSON.parse(localFaqs) : DEFAULT_FAQS);

    const localCalcs = localStorage.getItem("ss_calcs");
    setSavedCalculations(localCalcs ? JSON.parse(localCalcs) : []);

    const localBudgets = localStorage.getItem("ss_budgets");
    setBudgetLimits(localBudgets ? JSON.parse(localBudgets) : DEFAULT_BUDGETS);
    
    // Load saved language
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguageState(savedLang);
  }, []);

  // Sync helpers to localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Auth Operations
  const loginUser = (email: string, role: "USER" | "ADMIN" = "USER"): boolean => {
    const newUser: User = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      role: email.toLowerCase().includes("admin") ? "ADMIN" : role,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
      isVerified: true
    };
    setUser(newUser);
    saveToStorage("ss_user", newUser);
    return true;
  };

  const registerUser = (name: string, email: string) => {
    const newUser: User = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: email.toLowerCase().includes("admin") ? "ADMIN" : "USER",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
      isVerified: false // Needs email verification simulated
    };
    setUser(newUser);
    saveToStorage("ss_user", newUser);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("ss_user");
  };

  const updateProfile = (name: string, email: string, avatar?: string, role?: "USER" | "ADMIN") => {
    if (user) {
      const updated = { ...user, name, email, avatar: avatar || user.avatar, role: role || user.role };
      setUser(updated);
      saveToStorage("ss_user", updated);
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  // Transactions CRUD
  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...tx,
      id: "tx-" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveToStorage("ss_transactions", updated);
  };

  const editTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTransactions(updated);
    saveToStorage("ss_transactions", updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveToStorage("ss_transactions", updated);
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goal,
      id: "g-" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveToStorage("ss_goals", updated);
  };

  const fundGoal = (id: string, amount: number) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const nextAmount = Math.max(0, Math.min(g.targetAmount, g.currentAmount + amount));
        return { ...g, currentAmount: nextAmount };
      }
      return g;
    });
    setGoals(updated);
    saveToStorage("ss_goals", updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveToStorage("ss_goals", updated);
  };

  // Blog posts CRUD
  const addBlogPost = (post: Omit<BlogPost, "id" | "publishedAt">) => {
    const newPost: BlogPost = {
      ...post,
      id: "blog-" + Math.random().toString(36).substr(2, 9),
      publishedAt: new Date().toISOString()
    };
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    saveToStorage("ss_blogs", updated);
  };

  const deleteBlogPost = (id: string) => {
    const updated = blogPosts.filter((p) => p.id !== id);
    setBlogPosts(updated);
    saveToStorage("ss_blogs", updated);
  };

  // Contact messages CRUD
  const addContactMessage = (msg: Omit<ContactMessage, "id" | "isRead" | "createdAt">) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: "m-" + Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const updated = [newMsg, ...contactMessages];
    setContactMessages(updated);
    saveToStorage("ss_messages", updated);
  };

  const markMessageRead = (id: string) => {
    const updated = contactMessages.map((m) => (m.id === id ? { ...m, isRead: true } : m));
    setContactMessages(updated);
    saveToStorage("ss_messages", updated);
  };

  // FAQs CRUD
  const addFAQ = (faq: Omit<FAQ, "id">) => {
    const newFAQ: FAQ = {
      ...faq,
      id: "faq-" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...faqs, newFAQ];
    setFaqs(updated);
    saveToStorage("ss_faqs", updated);
  };

  const deleteFAQ = (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    saveToStorage("ss_faqs", updated);
  };

  // Saved calculations CRUD
  const saveCalculation = (calc: Omit<SavedCalculation, "id" | "date">) => {
    const newCalc: SavedCalculation = {
      ...calc,
      id: "calc-" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0]
    };
    const updated = [newCalc, ...savedCalculations];
    setSavedCalculations(updated);
    saveToStorage("ss_calcs", updated);
  };

  const deleteCalculation = (id: string) => {
    const updated = savedCalculations.filter((c) => c.id !== id);
    setSavedCalculations(updated);
    saveToStorage("ss_calcs", updated);
  };

  // Budget Limits
  const setBudgetLimit = (category: string, limit: number) => {
    const exists = budgetLimits.some((b) => b.category === category);
    let updated;
    if (exists) {
      updated = budgetLimits.map((b) => (b.category === category ? { ...b, limit } : b));
    } else {
      updated = [...budgetLimits, { category, limit }];
    }
    setBudgetLimits(updated);
    saveToStorage("ss_budgets", updated);
  };

  return (
    <AppStateContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        language,
        setLanguage,
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        goals,
        addGoal,
        fundGoal,
        deleteGoal,
        blogPosts,
        addBlogPost,
        deleteBlogPost,
        contactMessages,
        addContactMessage,
        markMessageRead,
        faqs,
        addFAQ,
        deleteFAQ,
        savedCalculations,
        saveCalculation,
        deleteCalculation,
        budgetLimits,
        setBudgetLimit
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
