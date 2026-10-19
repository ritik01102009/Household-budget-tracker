"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState, Transaction } from "@/lib/store";
import { 
  Plus, Edit2, Trash2, Search, Filter, Download, FileText, AlertTriangle, 
  Upload, X, HelpCircle, ArrowUpRight, ArrowDownRight, Wallet, Check, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Rental income", "Investments", "Bonus", "Other income"
];

const EXPENSE_CATEGORIES = [
  "Housing", "Utilities", "Internet & Phone", "Food & Grocery", "Dining Out", 
  "Transportation", "Fuel", "Insurance", "Healthcare", "Education", "Shopping", 
  "Entertainment", "Travel", "Savings", "Investments", "Debt Payments", "Miscellaneous"
];

export default function BudgetTracker() {
  const { 
    transactions, addTransaction, editTransaction, deleteTransaction, 
    budgetLimits, setBudgetLimit 
  } = useAppState();

  // Filters state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [catFilter, setCatFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Add / Edit Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [txType, setTxType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState(EXPENSE_CATEGORIES[3]); // Food & Grocery
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [txNote, setTxNote] = useState("");
  const [txRecurring, setTxRecurring] = useState(false);
  
  // Mock Receipt Upload state
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState("");

  // Budget Limit Config Modal state
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitCategory, setLimitCategory] = useState(EXPENSE_CATEGORIES[3]);
  const [limitAmount, setLimitAmount] = useState("");

  // Export Feedback state
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Set category dropdown when type toggles
  const handleTypeToggle = (type: "INCOME" | "EXPENSE") => {
    setTxType(type);
    setTxCategory(type === "INCOME" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  // Open Add modal
  const openAddModal = () => {
    setEditingId(null);
    setTxType("EXPENSE");
    setTxAmount("");
    setTxCategory(EXPENSE_CATEGORIES[3]);
    setTxDate(new Date().toISOString().split("T")[0]);
    setTxNote("");
    setTxRecurring(false);
    setReceiptFile(null);
    setReceiptName("");
    setModalOpen(true);
  };

  // Open Edit modal
  const openEditModal = (tx: Transaction) => {
    setEditingId(tx.id);
    setTxType(tx.type);
    setTxAmount(tx.amount.toString());
    setTxCategory(tx.category);
    setTxDate(tx.date);
    setTxNote(tx.note || "");
    setTxRecurring(tx.isRecurring);
    setReceiptFile(null);
    setReceiptName("");
    setModalOpen(true);
  };

  // Handle Save Transaction (Add/Edit)
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || Number(txAmount) <= 0) return;

    const txData = {
      type: txType,
      amount: Number(txAmount),
      category: txCategory,
      date: txDate,
      note: txNote.trim(),
      isRecurring: txRecurring
    };

    if (editingId) {
      editTransaction(editingId, txData);
    } else {
      addTransaction(txData);
    }

    setModalOpen(false);
  };

  // Save budget category limit
  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitAmount || Number(limitAmount) <= 0) return;
    setBudgetLimit(limitCategory, Number(limitAmount));
    setLimitAmount("");
    setLimitModalOpen(false);
  };

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.note?.toLowerCase().includes(search.toLowerCase()) || 
                          tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" ? true : tx.type === typeFilter;
    const matchesCategory = catFilter === "ALL" ? true : tx.category === catFilter;
    const matchesStart = startDate ? tx.date >= startDate : true;
    const matchesEnd = endDate ? tx.date <= endDate : true;

    return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd;
  });

  // Calculate limits spending progress
  const categorySpentMap = React.useMemo(() => {
    const map: { [cat: string]: number } = {};
    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE") {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      }
    });
    return map;
  }, [transactions]);

  // Export functions
  const triggerExportFeedback = (type: string) => {
    setExportSuccess(`Data successfully compiled and downloaded as ${type}!`);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const handleExportCSV = () => {
    // Generate CSV string
    const headers = "ID,Type,Category,Amount,Date,Note,Recurring\n";
    const rows = filteredTransactions.map(tx => 
      `"${tx.id}","${tx.type}","${tx.category}",${tx.amount},"${tx.date}","${tx.note || ""}",${tx.isRecurring}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `spendsensie_budget_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    triggerExportFeedback("CSV");
  };

  const handleExportExcel = () => {
    // Simply download formatted JSON structure mimicking excel tables
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredTransactions, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `spendsensie_budget_${new Date().toISOString().split("T")[0]}.xlsx.json`);
    link.click();
    triggerExportFeedback("Excel (.json format)");
  };

  // Mock receipt uploader file changer
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptName(file.name);
      setReceiptFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center space-x-2">
                <Wallet className="w-8 h-8 text-brand-500" />
                <span>Budget & Ledger Tracker</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Add items, plan custom budgets, and download structured logs.</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setLimitModalOpen(true)}
                className="px-4 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-darkbg-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-sm font-semibold flex items-center space-x-1.5 text-slate-750 dark:text-slate-250"
              >
                <Settings className="w-4 h-4 text-emerald-500" />
                <span>Configure Limits</span>
              </button>
              
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-500/15"
              >
                <Plus className="w-4 h-4" />
                <span>New Transaction</span>
              </button>
            </div>
          </div>

          {exportSuccess && (
            <div className="mb-6 p-4 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-2xl text-xs flex items-center space-x-2 animate-fade-in-up">
              <Check className="w-4 h-4" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Grid Layout: Left Ledger, Right Limits progress */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Ledger Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Search and Filters panel */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Search Query */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search notes/categories..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                  >
                    <option value="ALL">All Types</option>
                    <option value="INCOME">Income Only</option>
                    <option value="EXPENSE">Expenses Only</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Housing">Housing</option>
                    <option value="Food & Grocery">Food & Grocery</option>
                    <option value="Dining Out">Dining Out</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Savings">Savings</option>
                    <option value="Investments">Investments</option>
                  </select>
                </div>

                {/* Extended Date Filters */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400 font-semibold">Start Date:</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none"
                    />
                    <span className="text-slate-400 font-semibold pl-2">End Date:</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExportCSV}
                      className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-55 rounded-xl text-slate-500 flex items-center space-x-1.5 text-xs font-semibold"
                      title="Download CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button
                      onClick={handleExportExcel}
                      className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-55 rounded-xl text-slate-500 flex items-center space-x-1.5 text-xs font-semibold"
                      title="Download Excel"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Export Excel</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger List */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display mb-4">
                  Ledger Transactions Log ({filteredTransactions.length})
                </h3>

                {filteredTransactions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-8 text-center leading-normal">No matching transactions found. Try adjusting filters or click New Transaction.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1">
                    {filteredTransactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="py-3.5 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center space-x-3 max-w-[70%]">
                          <span className={`p-2 rounded-xl flex-shrink-0 ${
                            tx.type === "INCOME" 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450" 
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}>
                            {tx.type === "INCOME" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{tx.note || tx.category}</p>
                            <p className="text-slate-400 text-[10px] mt-0.5 font-medium">Category: <span className="text-slate-500">{tx.category}</span> | Date: {tx.date} {tx.isRecurring && "| Recurring"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`font-bold text-sm ${
                            tx.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"
                          }`}>
                            {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toLocaleString()}
                          </span>
                          
                          <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(tx)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-slate-655"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-rose-500"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Monthly budgets progress & alerts */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-850">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                    Monthly Budget Limits
                  </h3>
                  <button
                    onClick={() => setLimitModalOpen(true)}
                    className="text-xs font-bold text-brand-655 hover:underline"
                  >
                    Add Limit
                  </button>
                </div>

                {budgetLimits.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No category limits set yet.</p>
                ) : (
                  <div className="space-y-4">
                    {budgetLimits.map((b) => {
                      const spent = categorySpentMap[b.category] || 0;
                      const percent = Math.min(100, Math.round((spent / b.limit) * 100));
                      const isDanger = spent > b.limit;
                      const isWarning = spent > b.limit * 0.8 && spent <= b.limit;

                      return (
                        <div key={b.category} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-655">{b.category}</span>
                            <span className="text-slate-400">
                              <span className={isDanger ? "text-rose-500 font-bold" : isWarning ? "text-amber-500 font-bold" : "text-brand-600 dark:text-brand-400"}>
                                ${spent.toLocaleString()}
                              </span>
                              {" "}/ ${b.limit.toLocaleString()} ({percent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isDanger ? "bg-rose-500" : isWarning ? "bg-amber-400" : "bg-brand-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          {isDanger && (
                            <div className="text-[10px] text-rose-500 flex items-center space-x-1 font-bold animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>Over budget allocation limit!</span>
                            </div>
                          )}
                          {isWarning && (
                            <div className="text-[10px] text-amber-500 flex items-center space-x-1 font-bold">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>Approaching budget ceiling (&gt;80%)</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Add / Edit Transaction modal popup */}
          <AnimatePresence>
            {modalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
                >
                  <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-150 rounded-lg text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-4">
                    {editingId ? "Edit Ledger Transaction" : "New Ledger Entry"}
                  </h3>

                  <form onSubmit={handleSaveTransaction} className="space-y-4">
                    
                    {/* Type selector */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => handleTypeToggle("EXPENSE")}
                        className={`flex-1 py-2 rounded-lg text-center transition-colors ${txType === "EXPENSE" ? "bg-white dark:bg-darkbg-800 text-rose-500 shadow-sm" : "text-slate-400"}`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeToggle("INCOME")}
                        className={`flex-1 py-2 rounded-lg text-center transition-colors ${txType === "INCOME" ? "bg-white dark:bg-darkbg-800 text-emerald-600 shadow-sm" : "text-slate-400"}`}
                      >
                        Income
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Amount */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Amount ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          placeholder="e.g. 15.50"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Category</label>
                        <select
                          value={txCategory}
                          onChange={(e) => setTxCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                        >
                          {(txType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Transaction Date</label>
                        <input
                          type="date"
                          value={txDate}
                          onChange={(e) => setTxDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                        />
                      </div>

                      {/* Recurring Switch */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Transaction Interval</label>
                        <div className="flex items-center space-x-2 h-9">
                          <input
                            type="checkbox"
                            id="recurring"
                            checked={txRecurring}
                            onChange={(e) => setTxRecurring(e.target.checked)}
                            className="rounded text-emerald-500 accent-emerald-500 focus:ring-emerald-500"
                          />
                          <label htmlFor="recurring" className="text-xs text-slate-500 font-semibold">Recurring Monthly</label>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Notes / Details</label>
                      <input
                        type="text"
                        value={txNote}
                        onChange={(e) => setTxNote(e.target.value)}
                        placeholder="e.g. Weekly grocery restock"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                      />
                    </div>

                    {/* Receipt Upload Block */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Receipt Attachment (Mock Upload)</label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <Upload className="w-5 h-5 mx-auto text-slate-400 group-hover:scale-110 transition-transform" />
                          <p className="text-xs text-slate-500 font-semibold">{receiptName || "Click or drag files here to upload receipt"}</p>
                          <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                      {receiptFile && (
                        <div className="mt-2 text-xs text-brand-600 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Receipt "{receiptName}" attached successfully!</span>
                        </div>
                      )}
                    </div>

                    {/* Save Button */}
                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/15"
                      >
                        Save Ledger Item
                      </button>
                    </div>

                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Budget Limit Config Modal */}
          <AnimatePresence>
            {limitModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
                >
                  <button
                    onClick={() => setLimitModalOpen(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-150 rounded-lg text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display mb-4">
                    Configure Category Budget Ceiling
                  </h3>

                  <form onSubmit={handleSaveLimit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Target Category</label>
                      <select
                        value={limitCategory}
                        onChange={(e) => setLimitCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none font-semibold"
                      >
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Monthly Budget Ceiling ($)</label>
                      <input
                        type="number"
                        value={limitAmount}
                        onChange={(e) => setLimitAmount(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setLimitModalOpen(false)}
                        className="px-4 py-2 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                      >
                        Apply Ceiling
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}
